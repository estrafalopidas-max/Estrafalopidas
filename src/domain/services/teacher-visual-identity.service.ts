/**
 * Teacher Visual Identity Service
 * Integrates Excel color mapping with 20% opacity, Title Case normalization,
 * and 2-letter initials extraction for the Desktop Matrix.
 */

import {
  getTeacherExcelIdentity,
  TeacherExcelIdentity,
  toTitleCase,
  getTeacherInitials,
  hexToRgba,
  EXCEL_TEACHERS_DICTIONARY,
  updateTeacherDictionaryColor,
} from './teacher-normalization.service';

export type TeacherVisualIdentity = TeacherExcelIdentity & {
  name: string;
};

export {
  toTitleCase,
  getTeacherInitials,
  hexToRgba,
  EXCEL_TEACHERS_DICTIONARY,
  updateTeacherDictionaryColor,
};

/**
 * Returns deterministic visual identity with Excel original color, 20% opacity background,
 * normalized Title Case name, and 2-letter initials.
 */
export function getTeacherVisualIdentity(
  teacherId?: string | null,
  teacherName?: string | null
): TeacherVisualIdentity {
  const excelIdentity = getTeacherExcelIdentity(teacherId, teacherName);
  return {
    ...excelIdentity,
    name: excelIdentity.normalizedName,
  };
}
