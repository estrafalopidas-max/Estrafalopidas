import React, { useMemo, useState, useEffect, useRef } from 'react';
import { TimeBlockEntity, classifyBlockType } from '../../../domain/entities/time-block.entity';
import { AbsenceRequestEntity } from '../../../domain/entities/absence-request.entity';
import { AlertCircle, CheckCircle2, AlertTriangle, Coffee, LogOut, Laptop, GripVertical, Pencil } from 'lucide-react';
import { getTeacherVisualIdentity, toTitleCase, EXCEL_TEACHERS_DICTIONARY } from '../../../domain/services/teacher-visual-identity.service';
import { reconcileSubjectWithCatalog } from '../../../domain/services/subject-normalization.service';
import { useCoordinatorMatrix } from '../../context/CoordinatorMatrixContext';
import { calculateLuminanceContrast } from '../../../domain/services/teacher-color.service';

/**
 * Algoritmo de Iniciales Automáticas:
 * Extrae la primera letra del nombre y la primera letra del apellido.
 * Ejemplo: para 'Alex Uribe' -> 'AU'.
 * Ejemplo: para 'Carlos Mendoza' -> 'CM'.
 * Ejemplo: para 'Diana Marcela Vélez' -> 'DV'.
 */
export function getFirstAndLastNameInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return '--';

  const clean = name
    .trim()
    .replace(/^(prof\.|docente|profesor|profesora|lic\.|ing\.|coord\.)\s+/i, '');

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '--';

  if (words.length === 1) {
    const single = words[0];
    return single.length >= 2
      ? (single[0] + single[1]).toUpperCase()
      : single[0].toUpperCase();
  }

  // Primera letra del primer nombre y primera letra del último apellido
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * Motor de Contraste de Luminancia (WCAG ITU-R BT.601):
 * Asigna obligatoriamente texto blanco ('text-white') a fondos oscuros/saturados
 * y texto negro ('text-gray-900') a fondos claros. Prohibido usar gris.
 */
export function getContrastTextColor(color: string | null | undefined): 'text-white' | 'text-gray-900' {
  return calculateLuminanceContrast(color);
}

interface MatrixSlotCardProps {
  timeBlock: TimeBlockEntity | null;
  pendingAbsence?: AbsenceRequestEntity | null;
  officialSubjects?: string[];
  onClick?: () => void;
}

export const MatrixSlotCard: React.FC<MatrixSlotCardProps> = ({
  timeBlock,
  pendingAbsence,
  officialSubjects,
  onClick,
}) => {
  const { officialSubjects: contextOfficialSubjects, getTeacherColor, teachers, openTeacherModal } = useCoordinatorMatrix();

  const effectiveOfficialSubjects = officialSubjects || contextOfficialSubjects || [];

  // Transición suave al reordenar o reubicar un bloque en la celda
  const [isSettling, setIsSettling] = useState(false);
  const prevSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!timeBlock) {
      prevSignatureRef.current = null;
      return;
    }
    const currentSignature = `${timeBlock.id}_${timeBlock.gradeId}_${timeBlock.period}_${timeBlock.teacherId}_${timeBlock.subject}`;
    if (prevSignatureRef.current !== null && prevSignatureRef.current !== currentSignature) {
      setIsSettling(true);
      const timer = setTimeout(() => setIsSettling(false), 240);
      prevSignatureRef.current = currentSignature;
      return () => clearTimeout(timer);
    }
    prevSignatureRef.current = currentSignature;
  }, [timeBlock?.id, timeBlock?.gradeId, timeBlock?.period, timeBlock?.teacherId, timeBlock?.subject]);

  // Single Source of Truth: Reconcile subject with canonical normalization & Teacher Registration Catalog
  const subjectResult = useMemo(
    () => reconcileSubjectWithCatalog(timeBlock?.subject, effectiveOfficialSubjects),
    [timeBlock?.subject, effectiveOfficialSubjects]
  );

  if (!timeBlock) {
    return (
      <div className="h-full min-h-[100px] p-1.5 bg-gray-50/80 hover:bg-gray-100/70 border border-dashed border-gray-300 rounded-xl flex items-center justify-center select-none transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <span className="text-xs text-center text-gray-500 whitespace-normal break-words leading-tight">
          Sin asignación académica
        </span>
      </div>
    );
  }

  // Detect non-conventional block types: break, exit
  const effectiveType = (timeBlock.block_type && timeBlock.block_type !== 'class')
    ? timeBlock.block_type
    : classifyBlockType(timeBlock.subject);

  // Robust check for novelty: block_type, motivo_novedad, notes or subject starting with NOVEDAD
  const isNovelty =
    effectiveType === 'novelty' ||
    timeBlock.block_type === 'novelty' ||
    Boolean(timeBlock.motivo_novedad) ||
    Boolean(timeBlock.notes && timeBlock.notes.toLowerCase().includes('novedad')) ||
    Boolean(timeBlock.subject && timeBlock.subject.toUpperCase().startsWith('NOVEDAD'));

  // Renderizado de Alerta Visual: Mutación a Novedad Institucional (Bloque Único)
  if (isNovelty) {
    const rawCandidate = (
      timeBlock.motivo_novedad ||
      (timeBlock.notes
        ? timeBlock.notes.replace(/^(evento institucional programado:\s*|novedad:\s*)/i, '')
        : '') ||
      (timeBlock.teacherId === 'evento-institucional' && timeBlock.subject
        ? timeBlock.subject
        : '') ||
      (timeBlock.subject &&
      (timeBlock.subject.toUpperCase().startsWith('ACTO ') ||
        timeBlock.subject.toUpperCase().startsWith('ACTIVIDAD ') ||
        timeBlock.subject.toUpperCase().startsWith('NOVEDAD ') ||
        timeBlock.subject.toUpperCase().startsWith('REUNIÓN ') ||
        timeBlock.subject.toUpperCase().startsWith('JORNADA ') ||
        timeBlock.subject.toUpperCase().startsWith('DIRECCIÓN '))
        ? timeBlock.subject.replace(/^novedad:\s*/i, '')
        : '')
    )
      .replace(/🇨🇴/g, '')
      .trim();

    const noveltyReasonUpper =
      rawCandidate &&
      rawCandidate.toUpperCase() !== 'NOVEDAD' &&
      rawCandidate.toUpperCase() !== 'NOVEDAD INSTITUCIONAL'
        ? rawCandidate.toUpperCase()
        : 'NOVEDAD DOCENTE';

    const isActoCivico =
      noveltyReasonUpper.includes('ACTO CÍVICO') ||
      noveltyReasonUpper.includes('ACTO CIVICO');

    return (
      <div
        onClick={onClick}
        title={`NOVEDAD INSTITUCIONAL: ${noveltyReasonUpper}`}
        className={`h-full min-h-[100px] rounded-xl border-2 border-amber-500 bg-amber-50 hover:bg-amber-100/90 hover:border-amber-600 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform cursor-pointer flex flex-col justify-center items-center text-center p-1.5 gap-1.5 select-none shadow-xs group relative overflow-hidden ${
          isSettling ? 'scale-[0.97] opacity-90 shadow-md' : 'scale-100 opacity-100'
        }`}
      >
        {/* Encabezado: Icono de Advertencia y Título NOVEDAD INSTITUCIONAL */}
        <div className="flex items-center justify-center gap-1 text-amber-800 w-full px-0.5 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-[8px] sm:text-[8.5px] font-black uppercase tracking-tight text-amber-800 leading-[1.08] text-center">
            NOVEDAD INSTITUCIONAL
          </span>
        </div>

        {/* Descripción de la Novedad en Mayúscula Sostenida */}
        <div className="w-full px-1 flex flex-col items-center justify-center text-center overflow-hidden">
          <span
            className="text-[10px] sm:text-[10.5px] font-black uppercase text-amber-950 leading-[1.18] text-center break-words line-clamp-3 max-w-full inline-flex items-center justify-center gap-1 flex-wrap"
            title={noveltyReasonUpper}
          >
            {isActoCivico && (
              <svg
                viewBox="0 0 24 16"
                className="w-4 h-3 rounded-[2px] shadow-2xs border border-amber-900/25 shrink-0 inline-block"
                aria-label="Bandera de Colombia"
              >
                <rect width="24" height="8" y="0" fill="#FCD116" />
                <rect width="24" height="4" y="8" fill="#003893" />
                <rect width="24" height="4" y="12" fill="#CE1126" />
              </svg>
            )}
            <span>{noveltyReasonUpper}</span>
          </span>
        </div>
      </div>
    );
  }

  // Homologación de Celdas Activas: 'Media Técnica' consume estrictamente el mismo componente base que materias regulares (60/40)
  const isNonConventional = effectiveType === 'break' || effectiveType === 'exit';

  if (isNonConventional) {
    if (effectiveType === 'exit') {
      return (
        <div
          onClick={onClick}
          className="h-full min-h-[100px] p-1.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-400 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex flex-col justify-between items-center text-center select-none group"
        >
          {/* Fila 1 (Arriba): Icono sutil */}
          <div className="flex flex-col items-center justify-center w-full pt-0.5">
            <LogOut className="w-3.5 h-3.5 text-gray-400 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Fila 2 (Centro): Mitigación de Desbordamiento y Compresión Tipográfica */}
          <div className="my-0.5 flex items-center justify-center flex-1 w-full px-0.5">
            <span
              className="text-xs text-center text-gray-500 whitespace-normal break-words leading-tight"
              title="Sin asignación académica"
            >
              Sin asignación académica
            </span>
          </div>

          {/* Fila 3 (Abajo): Horario sutil */}
          <div className="w-full pt-0.5 border-t border-dashed border-gray-200">
            <span className="text-[8px] font-mono text-gray-400 block font-medium">
              {timeBlock.startTime} - {timeBlock.endTime}
            </span>
          </div>
        </div>
      );
    }

    if (effectiveType === 'break') {
      const icon = <Coffee className="w-3.5 h-3.5 text-gray-500 mb-0.5 shrink-0" />;
      const badgeText = 'Descanso';
      const mainTitle = timeBlock.subject && !timeBlock.subject.toUpperCase().includes('DESCANSO')
        ? timeBlock.subject
        : 'Descanso Pedagógico';
      const subtitle = `${timeBlock.startTime} - ${timeBlock.endTime}`;

      return (
        <div
          onClick={onClick}
          className="h-full min-h-[100px] p-1.5 rounded-xl border-2 border-gray-300 bg-gray-100 hover:bg-gray-200/80 hover:border-gray-400 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex flex-col justify-between items-center text-center select-none shadow-2xs group"
        >
          {/* Fila 1 (Arriba): Badge tipo / Icono */}
          <div className="flex flex-col items-center justify-center w-full">
            {icon}
            <span className="inline-block px-1.5 py-0.2 text-[8px] font-semibold uppercase tracking-wider rounded bg-white text-gray-700 border border-gray-300 shadow-2xs">
              {badgeText}
            </span>
          </div>

          {/* Fila 2 (Centro): Nombre completo con salto de línea natural */}
          <div className="my-0.5 flex items-center justify-center flex-1 w-full">
            <span className="whitespace-normal text-center text-xs font-semibold text-gray-800 leading-tight break-words px-0.5" title={timeBlock.subject}>
              {mainTitle}
            </span>
          </div>

          {/* Fila 3 (Abajo): Subtítulo u horario */}
          <div className="w-full pt-0.5 border-t border-gray-200">
            <span className="text-[9px] text-gray-600 font-medium block truncate">
              {subtitle}
            </span>
          </div>
        </div>
      );
    }
  }

  const isAbsent = timeBlock.status === 'absent';
  const isCovered = timeBlock.status === 'covered';
  const hasPending = Boolean(pendingAbsence);

  // Ruptura de Caché Visual (Re-render): El bloque lee style={{ backgroundColor: getTeacherColor(bloque.teacherId) }} calculándolo en tiempo real durante el renderizado
  const docenteColorHex = getTeacherColor
    ? getTeacherColor(timeBlock.teacherId, timeBlock.teacherName)
    : (getTeacherVisualIdentity(timeBlock.teacherId, timeBlock.teacherName).color_hex || '#007DC5');

  // Algoritmo de Iniciales Automáticas ('AU' para Alex Uribe)
  const teacherInitials = getFirstAndLastNameInitials(timeBlock.teacherName || timeBlock.teacherId);
  const normalizedTeacherName = toTitleCase(timeBlock.teacherName || timeBlock.teacherId || 'Sin Asignar');

  // Motor de Contraste: text-white o text-gray-900 (sin grises)
  const contrastClass = getContrastTextColor(docenteColorHex);

  return (
    <div
      onClick={onClick}
      className={`flex flex-col h-full min-h-[100px] overflow-hidden border border-gray-200 rounded-md transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform cursor-pointer select-none hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] relative group antialiased ${
        isSettling
          ? 'scale-[0.96] opacity-90 ring-2 ring-sky-400/50 shadow-md'
          : 'scale-100 opacity-100'
      } ${
        isAbsent
          ? 'ring-2 ring-red-400 border-red-400'
          : isCovered
          ? 'ring-2 ring-emerald-400 border-emerald-400'
          : ''
      }`}
    >
      {/* Top Banner Ribbon for Pending Absence (Novedad) */}
      {hasPending && (
        <div className="absolute top-0 inset-x-0 z-10 bg-amber-400 text-gray-900 text-[8px] font-bold px-1 py-0.5 text-center uppercase tracking-tight flex items-center justify-center gap-0.5 shadow-2xs">
          <AlertTriangle className="w-2.5 h-2.5 text-gray-900 shrink-0" />
          <span className="truncate">Novedad</span>
        </div>
      )}

      {/* BLOQUE SUPERIOR (Datos de Clase - 58%): Nombre completo de materia a 2 líneas + aula */}
      <div className="bg-gray-50 h-[58%] px-1 py-0.5 flex flex-col items-center justify-center text-center relative w-full overflow-hidden">
        {/* Grip Icon visible on hover */}
        <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>

        {/* Materia en el centro: Nombre completo distribuido hasta en 2 líneas */}
        <span
          className="whitespace-normal break-words text-center text-[11.5px] sm:text-xs font-bold leading-[1.15] line-clamp-2 text-gray-900 px-0.5"
          title={subjectResult.officialName || subjectResult.displayName || subjectResult.rawSubject}
        >
          {subjectResult.shortName || subjectResult.displayName || subjectResult.rawSubject}
        </span>

        {/* Aula en el centro (debajo de la materia) */}
        <span className="text-[10px] font-medium text-gray-500 font-mono mt-0.5 truncate block w-full leading-none">
          {!timeBlock.classroomName
            ? 'Aula Base'
            : timeBlock.classroomName.trim().toUpperCase() === 'AULA ROTA' ||
              timeBlock.classroomName.trim().toUpperCase() === 'ROTA'
            ? 'Aula (ROTACIÓN)'
            : timeBlock.classroomName}
        </span>

        {/* Badges de estado si aplica */}
        {isAbsent && (
          <span className="mt-0.5 text-[8px] font-bold uppercase text-villa-magenta bg-red-50 border border-red-200 px-1 py-0.2 rounded shadow-2xs shrink-0 leading-tight">
            Ausente
          </span>
        )}
        {isCovered && (
          <span className="mt-0.5 text-[8px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded shadow-2xs truncate max-w-full leading-tight shrink-0">
            R: {toTitleCase(timeBlock.replacementTeacherName || 'Asignado')}
          </span>
        )}
      </div>

      {/* BLOQUE INFERIOR (Firma / Píldora del Docente - 42%): Nombre del profe con mayor tamaño a 2 líneas y lapicito en hover */}
      <div
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey) return;
          e.stopPropagation();
          const cleanName = (timeBlock.teacherName || '').trim().toLowerCase();
          const matchedTeacher = teachers.find(
            (t) =>
              t.id === timeBlock.teacherId ||
              (cleanName && t.displayName?.trim().toLowerCase() === cleanName)
          );
          if (matchedTeacher) {
            openTeacherModal(matchedTeacher, false);
          } else if (timeBlock.teacherId && timeBlock.teacherId !== 'unassigned') {
            openTeacherModal(
              {
                id: timeBlock.teacherId,
                displayName: normalizedTeacherName,
                email: `${cleanName.replace(/\s+/g, '.')}@villaflora.edu.co`,
                role: 'teacher',
                documentId: '',
                maxWeeklyHours: 24,
                color_hex: docenteColorHex,
                color: docenteColorHex,
                subjects: timeBlock.subject ? [timeBlock.subject] : [],
                allowedSubjects: timeBlock.subject ? [timeBlock.subject] : [],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              false
            );
          } else if (onClick) {
            onClick();
          }
        }}
        className="group/pill w-full h-[42%] flex items-center shrink-0 overflow-hidden cursor-pointer relative hover:brightness-95 transition-all"
        style={{ backgroundColor: docenteColorHex }}
        title={`Clic para editar docente: ${normalizedTeacherName}`}
      >
        {/* Avatar de Iniciales (Izquierda): Ancho estricto w-6 con bg-black/20; muestra lapicito al hacer hover */}
        <div className="w-6 flex-shrink-0 flex items-center justify-center h-full bg-black/20 font-bold text-[10px] text-white select-none relative">
          <span className="group-hover/pill:opacity-0 group-hover:opacity-0 transition-opacity duration-150">
            {teacherInitials}
          </span>
          <Pencil className="w-3 h-3 text-white absolute opacity-0 group-hover/pill:opacity-100 group-hover:opacity-100 transition-opacity duration-150" />
        </div>

        {/* Nombre del Profesor (Derecha): Texto aumentado (11px-12px) distribuido a 2 líneas */}
        <span
          className={`flex-1 px-1 text-[11px] sm:text-xs leading-[1.15] text-center break-words line-clamp-2 text-ellipsis font-semibold ${contrastClass} ${
            isAbsent ? 'line-through opacity-80' : ''
          }`}
          title={`Clic para editar docente: ${normalizedTeacherName}`}
        >
          {normalizedTeacherName}
        </span>
      </div>
    </div>
  );
};
