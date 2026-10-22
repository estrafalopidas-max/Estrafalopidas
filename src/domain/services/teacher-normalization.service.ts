/**
 * Teacher Normalization & HSL Golden Ratio Visual Identity Service
 * 
 * Implements:
 * 1. Title Case normalization (e.g. 'ALEJANDRO' -> 'Alejandro').
 * 2. Two-letter Avatar initials extraction (e.g. 'Alejandro' -> 'Al').
 * 3. Dynamic HSL Golden Angle color generation ensuring maximum chromatic distance.
 * 4. Automatic WCAG luminance contrast calculation.
 */

import {
  getTeacherDeterministicColor,
  hashTeacherString,
  calculateLuminanceContrast,
  hexToRgb,
} from './teacher-color.service';

export interface TeacherExcelIdentity {
  id: string;
  originalName: string;
  normalizedName: string;
  initials: string;
  originalExcelHex: string;
  color_hex: string;       // Inmutable static Hex ('#RRGGBB')
  backgroundColor: string; // 20% opacity rgba(r, g, b, 0.20)
  borderColor: string;     // 40% opacity rgba(r, g, b, 0.40)
  accentColor: string;     // Solid hex from Golden Ratio engine or persistent profile
  avatarBg: string;        // Solid hex or high-contrast accent
  avatarText: string;      // Crisp white #FFFFFF
  textColor: string;       // Dynamic contrast text for WCAG compliance
  badgeBg: string;         // Soft pill background
  badgeText: string;       // Contrast text for pill
}

export interface ExcelTeacherEntry {
  canonicalName: string;
  originalExcelHex?: string;
  specialty?: string;
}

/**
 * Converts uppercase or unformatted text to proper Title Case.
 * Example: 'ALEJANDRO' -> 'Alejandro'
 * Example: 'CARLOS MENDOZA' -> 'Carlos Mendoza'
 */
export function toTitleCase(input: string | null | undefined): string {
  if (!input || !input.trim()) return '';

  const lowercaseWords = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a']);

  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (word.length === 0) return '';
      // If it's a preposition/connector and not the first word, keep lowercase
      if (index > 0 && lowercaseWords.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Extracts the first two letters of the teacher's name for Avatar display.
 * Example: 'Alejandro' -> 'Al'
 * Example: 'ALEJANDRO' -> 'Al'
 * Example: 'Mateo Arango' -> 'Ma'
 */
export function getTeacherInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return 'Do';

  // Remove common academic prefixes if present
  const clean = name
    .trim()
    .replace(/^(prof\.|docente|profesor|profesora|lic\.|ing\.|coord\.)\s+/i, '');

  const firstWord = clean.split(/\s+/)[0] || '';

  if (firstWord.length >= 2) {
    return firstWord.charAt(0).toUpperCase() + firstWord.charAt(1).toLowerCase();
  } else if (firstWord.length === 1) {
    return firstWord.toUpperCase() + 'd';
  }

  return 'Do';
}

/**
 * Converts a hex color (#RRGGBB or #RGB) into an rgba string with custom alpha.
 */
export function hexToRgba(hex: string, alpha: number = 0.2): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * In-memory / storage lookup for persistent teacher color
 */
export function getTeacherColorFromStorage(teacherId?: string | null, teacherName?: string | null): string | null {
  try {
    const raw = localStorage.getItem('ievf_users_v1');
    if (raw) {
      const users: Array<{ id: string; displayName: string; color?: string; color_hex?: string; avatarColor?: string }> = JSON.parse(raw);
      const cleanId = (teacherId || '').trim().toLowerCase();
      const cleanName = (teacherName || '').trim().toLowerCase();

      const match = users.find((u) => {
        const uId = (u.id || '').trim().toLowerCase();
        const uName = (u.displayName || '').trim().toLowerCase();
        if (cleanId && uId === cleanId) return true;
        if (cleanName && uName === cleanName) return true;
        if (cleanName && uName && (cleanName.includes(uName) || uName.includes(cleanName))) return true;
        if (cleanId && uId && (cleanId.includes(uId) || uId.includes(cleanId))) return true;
        return false;
      });

      if (match?.color_hex) return match.color_hex;
      if (match?.color) return match.color;
      if (match?.avatarColor) return match.avatarColor;
    }
  } catch {}
  return null;
}

/**
 * Master Dictionary of Teachers (canonical name mappings with immediate manual patch overrides)
 */
export const EXCEL_TEACHERS_DICTIONARY: Record<string, ExcelTeacherEntry> = {
  // Parche de Datos Inmediato: Valores diametralmente opuestos para destruir colisión
  'ALEJANDRO': { canonicalName: 'Alejandro', originalExcelHex: '#1E3A8A' }, // Azul Oscuro
  'ALEJANDRO RESTREPO': { canonicalName: 'Alejandro Restrepo', originalExcelHex: '#1E3A8A' },
  't-alejandro': { canonicalName: 'Alejandro', originalExcelHex: '#1E3A8A' },
  't-alejandro-restrepo': { canonicalName: 'Alejandro Restrepo', originalExcelHex: '#1E3A8A' },
  'JAIRO': { canonicalName: 'Jairo Andrés', originalExcelHex: '#EA580C' }, // Naranja
  'JAIRO ANDRES': { canonicalName: 'Jairo Andrés', originalExcelHex: '#EA580C' },
  'JAIRO ANDRÉS': { canonicalName: 'Jairo Andrés', originalExcelHex: '#EA580C' },
  't-jairo': { canonicalName: 'Jairo Andrés', originalExcelHex: '#EA580C' },
  't-jairo-andres': { canonicalName: 'Jairo Andrés', originalExcelHex: '#EA580C' },
  'CLAUDIA': { canonicalName: 'Claudia', originalExcelHex: '#34D399' }, // Verde Menta
  'CLAUDIA GOMEZ': { canonicalName: 'Claudia Gómez', originalExcelHex: '#34D399' },
  'CLAUDIA GÓMEZ': { canonicalName: 'Claudia Gómez', originalExcelHex: '#34D399' },
  't-claudia': { canonicalName: 'Claudia', originalExcelHex: '#34D399' },
  't-claudia-gomez': { canonicalName: 'Claudia Gómez', originalExcelHex: '#34D399' },

  // Resto de asignaciones canónicas
  'CARLOS MENDOZA': { canonicalName: 'Carlos Mendoza' },
  'LAURA RESTREPO': { canonicalName: 'Laura Restrepo' },
  'ANDRES GIRALDO': { canonicalName: 'Andrés Giraldo' },
  'ANDRÉS GIRALDO': { canonicalName: 'Andrés Giraldo' },
  'SOFIA OSPINA': { canonicalName: 'Sofía Ospina' },
  'SOFÍA OSPINA': { canonicalName: 'Sofía Ospina' },
  'DIEGO HENAO': { canonicalName: 'Diego Henao' },
  'VALENTINA CANO': { canonicalName: 'Valentina Cano' },
  'MATEO ARANGO': { canonicalName: 'Mateo Arango' },
  'ISABEL ZULUAGA': { canonicalName: 'Isabel Zuluaga' },
  'JULIAN MORALES': { canonicalName: 'Julián David Morales' },
  'JULIÁN MORALES': { canonicalName: 'Julián David Morales' },
  'JULIÁN DAVID MORALES': { canonicalName: 'Julián David Morales' },
  'DIANA VELEZ': { canonicalName: 'Diana Marcela Vélez' },
  'DIANA VÉLEZ': { canonicalName: 'Diana Marcela Vélez' },
  'DIANA MARCELA VÉLEZ': { canonicalName: 'Diana Marcela Vélez' },
  'ALEX': { canonicalName: 'Alex' },
  'ALEXANDER': { canonicalName: 'Alex' },
  't-alex': { canonicalName: 'Alex' },
  't-alexander': { canonicalName: 'Alex' },
  't-carlos-mendoza': { canonicalName: 'Carlos Mendoza' },
  't-laura-restrepo': { canonicalName: 'Laura Restrepo' },
  't-andres-giraldo': { canonicalName: 'Andrés Giraldo' },
  't-sofia-ospina': { canonicalName: 'Sofía Ospina' },
  't-diego-henao': { canonicalName: 'Diego Henao' },
  't-valentina-cano': { canonicalName: 'Valentina Cano' },
  't-mateo-arango': { canonicalName: 'Mateo Arango' },
  't-isabel-zuluaga': { canonicalName: 'Isabel Zuluaga' },
  't-julian-morales': { canonicalName: 'Julián David Morales' },
  't-diana-velez': { canonicalName: 'Diana Marcela Vélez' },
};

export { hashTeacherString };

/**
 * Updates a teacher's color in the in-memory canonical dictionary for real-time propagation.
 */
export function updateTeacherDictionaryColor(teacherIdOrName: string, newHex: string): void {
  if (!teacherIdOrName || !newHex) return;
  const cleanUpper = teacherIdOrName.trim().toUpperCase();
  const cleanLower = teacherIdOrName.trim().toLowerCase();

  if (EXCEL_TEACHERS_DICTIONARY[cleanUpper]) {
    EXCEL_TEACHERS_DICTIONARY[cleanUpper].originalExcelHex = newHex;
  }
  if (EXCEL_TEACHERS_DICTIONARY[cleanLower]) {
    EXCEL_TEACHERS_DICTIONARY[cleanLower].originalExcelHex = newHex;
  }

  // Actualizar también entradas canónicas o alias relacionados
  Object.keys(EXCEL_TEACHERS_DICTIONARY).forEach((key) => {
    const kUpper = key.toUpperCase();
    if (
      kUpper === cleanUpper ||
      (cleanUpper.length >= 4 && (kUpper.includes(cleanUpper) || cleanUpper.includes(kUpper)))
    ) {
      EXCEL_TEACHERS_DICTIONARY[key].originalExcelHex = newHex;
    }
  });
}

/**
 * Normalizes any teacher name or ID, applying Title Case and returning
 * their persistent solid color from VILLA_FLORA_PALETTE and WCAG compliant contrast properties.
 */
export function getTeacherExcelIdentity(
  teacherId?: string | null,
  teacherName?: string | null
): TeacherExcelIdentity {
  const rawId = (teacherId || '').trim();
  const rawName = (teacherName || '').trim();

  // If unassigned
  if (
    (!rawId && !rawName) ||
    rawId === 'unassigned' ||
    rawName.toLowerCase() === 'sin asignar' ||
    rawName.toLowerCase() === 'sin asignación académica' ||
    rawName.toLowerCase() === 'sin asignacion academica' ||
    rawName.toLowerCase() === 'periodo libre'
  ) {
    return {
      id: rawId || 'unassigned',
      originalName: rawName || 'Sin Asignar',
      normalizedName: 'Sin Asignar',
      initials: '--',
      originalExcelHex: '#94A3B8',
      color_hex: '#94A3B8',
      backgroundColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      accentColor: '#94A3B8',
      avatarBg: '#E2E8F0',
      avatarText: '#475569',
      textColor: '#475569',
      badgeBg: '#F1F5F9',
      badgeText: '#64748B',
    };
  }

  // Canonical name in Title Case
  const dictKey = rawName.toUpperCase();
  const canonicalName = EXCEL_TEACHERS_DICTIONARY[dictKey]?.canonicalName ||
                        EXCEL_TEACHERS_DICTIONARY[rawId]?.canonicalName ||
                        toTitleCase(rawName || rawId);
  const initials = getTeacherInitials(canonicalName);

  // 1. First priority: Persistent color in database profile (docente.color_hex / docente.color)
  const storedColor = getTeacherColorFromStorage(rawId, canonicalName);

  // 2. Second priority: Manual patch override if specified in dictionary
  const dictionaryColor = EXCEL_TEACHERS_DICTIONARY[dictKey]?.originalExcelHex ||
                          EXCEL_TEACHERS_DICTIONARY[rawId]?.originalExcelHex;

  // 3. Third priority: Deterministic selection from curated VILLA_FLORA_PALETTE
  const solidColor = storedColor || dictionaryColor || getTeacherDeterministicColor(canonicalName || rawId);

  // Compute contrast according to WCAG
  const contrastClass = calculateLuminanceContrast(solidColor);
  const contrastText = contrastClass === 'text-white' ? '#FFFFFF' : '#1F2937';

  return {
    id: rawId || canonicalName,
    originalName: rawName || rawId,
    normalizedName: canonicalName,
    initials,
    originalExcelHex: solidColor,
    color_hex: solidColor,
    backgroundColor: hexToRgba(solidColor, 0.20),
    borderColor: hexToRgba(solidColor, 0.40),
    accentColor: solidColor,
    avatarBg: solidColor,
    avatarText: contrastText,
    textColor: '#1F2937', // Text on light background for badges/pills
    badgeBg: hexToRgba(solidColor, 0.15),
    badgeText: '#1F2937',
  };
}
