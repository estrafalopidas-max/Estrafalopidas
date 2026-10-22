import { useMemo, useCallback } from 'react';
import { UserEntity } from '../../domain/entities/user.entity';
import { TimeBlockEntity } from '../../domain/entities/time-block.entity';

export interface TeacherLoadInfo {
  currentAssignedHours: number;
  maxWeeklyHours: number;
  remainingHours: number;
  isOverloaded: boolean;
}

export function calculateTeacherAssignedHours(
  teacherId: string,
  teacherName: string | undefined,
  timeBlocks: TimeBlockEntity[]
): number {
  if (!timeBlocks || !Array.isArray(timeBlocks)) return 0;
  const cleanName = (teacherName || '').trim().toLowerCase();

  return timeBlocks.filter((b) => {
    if (!b || b.status === 'cancelled' || b.block_type === 'break') return false;
    const isRegularOwner =
      b.teacherId === teacherId ||
      (cleanName && b.teacherName?.trim().toLowerCase() === cleanName);
    const isReplacement =
      b.status === 'covered' &&
      (b.replacementTeacherId === teacherId ||
        (cleanName && b.replacementTeacherName?.trim().toLowerCase() === cleanName));

    if (b.status === 'absent') return false;
    if (b.status === 'covered') return isReplacement;
    return isRegularOwner;
  }).length;
}

export function useTeacherLoad(teachers: UserEntity[], timeBlocks: TimeBlockEntity[]) {
  const loadMap = useMemo(() => {
    const map = new Map<string, TeacherLoadInfo>();
    for (const t of teachers) {
      const assigned = calculateTeacherAssignedHours(t.id, t.displayName, timeBlocks);
      const rawMax = Number(t.maxWeeklyHours);
      const max = !rawMax || rawMax === 22 || rawMax === 25 ? 24 : rawMax;
      map.set(t.id, {
        currentAssignedHours: assigned,
        maxWeeklyHours: max,
        remainingHours: Math.max(0, max - assigned),
        isOverloaded: assigned > max,
      });
    }
    return map;
  }, [teachers, timeBlocks]);

  const getTeacherLoad = useCallback(
    (teacherId: string, teacherName?: string): TeacherLoadInfo => {
      const found = loadMap.get(teacherId);
      if (found) return found;
      const assigned = calculateTeacherAssignedHours(teacherId, teacherName, timeBlocks);
      const max = 24;
      return {
        currentAssignedHours: assigned,
        maxWeeklyHours: max,
        remainingHours: Math.max(0, max - assigned),
        isOverloaded: assigned > max,
      };
    },
    [loadMap, timeBlocks]
  );

  return { getTeacherLoad, loadMap };
}
