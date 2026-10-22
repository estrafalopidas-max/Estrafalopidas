import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import {
  PublicScheduleSnapshot,
  PublicDayConfigs,
  resolveEffectiveDayConfigs,
} from '../../domain/services/html-schedule-generator.service';
import { resolveCanonicalGradeName } from '../../domain/services/grade-normalization.service';

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  },
  firebaseConfig.firestoreDatabaseId
);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    if (sessionStorage.getItem('ievf_fb_tested') === '1') return;
    sessionStorage.setItem('ievf_fb_tested', '1');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

const SCHEDULE_COLLECTION = 'published_schedules';
const OFFICIAL_DOC_ID = 'official';
const LAST_FETCH_KEY = 'ievf_cloud_schedule_fetched_at';
const DAY_CONFIG_BLOCK_ID = '__ievf_day_configs__';

export interface CloudPublishedScheduleData extends PublicScheduleSnapshot {
  shortUrl?: string;
  shortCode?: string;
}

export function getPublicBaseUrl(): string {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('ievf_custom_public_domain') : null;
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

export function buildInternalShortUrl(code: string = 'vf'): string {
  const base = getPublicBaseUrl();
  return `${base}/h`;
}

function isGenuineExternalShortUrl(candidate: string | null | undefined, longUrl: string): candidate is string {
  if (!candidate || typeof candidate !== 'string') return false;
  if (!candidate.startsWith('http')) return false;
  if (candidate === longUrl) return false;
  if (candidate.includes('.run.app') || candidate.includes('localhost')) return false;
  return true;
}

export async function shortenUrlExternal(longUrl?: string): Promise<{ shortUrl: string; directUrl: string }> {
  const directUrl = longUrl || buildInternalShortUrl('vf');
  const fallbackShortRoute = `${getPublicBaseUrl()}/h`;
  const cachedKey = `ievf_short_url_${directUrl}`;
  const cached = typeof window !== 'undefined' ? localStorage.getItem(cachedKey) : null;
  if (isGenuineExternalShortUrl(cached, directUrl)) {
    localStorage.setItem('ievf_active_short_url', cached);
    return { shortUrl: cached, directUrl };
  } else if (cached && typeof window !== 'undefined') {
    localStorage.removeItem(cachedKey);
  }

  try {
    const response = await fetch(
      `/api/shorten-url?url=${encodeURIComponent(directUrl)}`
    );
    if (response.ok) {
      const data = await response.json();
      if (isGenuineExternalShortUrl(data?.shorturl, directUrl)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(cachedKey, data.shorturl);
          localStorage.setItem('ievf_active_short_url', data.shorturl);
        }
        return { shortUrl: data.shorturl, directUrl };
      }
    }
  } catch {
    // Fallback silencioso a la ruta corta institucional /h
  }

  return { shortUrl: fallbackShortRoute, directUrl };
}

export async function publishScheduleToCloud(
  snapshot: PublicScheduleSnapshot,
  shortUrl?: string,
  shortCode = 'vf'
): Promise<void> {
  const docPath = `${SCHEDULE_COLLECTION}/${OFFICIAL_DOC_ID}`;
  const sanitizedBlocks = snapshot.timeBlocks
    .filter((b) => b.id !== DAY_CONFIG_BLOCK_ID)
    .slice(0, 1499)
    .map((b) => ({
      id: String(b.id || ''),
      dayOfWeek: b.dayOfWeek,
      period: Number(b.period || 1),
      startTime: String(b.startTime || ''),
      endTime: String(b.endTime || ''),
      subject: String(b.subject || ''),
      teacherId: String(b.teacherId || ''),
      teacherName: String(b.teacherName || ''),
      classroomName: String(b.classroomName || ''),
      gradeName: resolveCanonicalGradeName(b),
      gradeId: String(b.gradeId || ''),
      status: String(b.status || 'covered'),
      block_type: String(b.block_type || 'class'),
      shift: String(b.shift || 'morning'),
      motivo_novedad: b.motivo_novedad ? String(b.motivo_novedad) : null,
      notes: b.notes ? String(b.notes) : null,
      replacementTeacherName: b.replacementTeacherName ? String(b.replacementTeacherName) : null,
      replacementTeacherId: b.replacementTeacherId ? String(b.replacementTeacherId) : null,
    }));

  const effectiveDayConfigs = resolveEffectiveDayConfigs(snapshot.dayConfigs);
  sanitizedBlocks.push({
    id: DAY_CONFIG_BLOCK_ID,
    dayOfWeek: 'lunes',
    period: 0,
    startTime: '00:00',
    endTime: '00:00',
    subject: JSON.stringify(effectiveDayConfigs),
    teacherId: 'system',
    teacherName: 'System',
    classroomName: 'System',
    gradeName: 'System',
    gradeId: '',
    status: 'cancelled',
    block_type: 'exit',
    shift: 'morning',
    motivo_novedad: null,
    notes: null,
    replacementTeacherName: null,
    replacementTeacherId: null,
  });

  const sanitizedTeachers = snapshot.teachers.slice(0, 300).map((t) => ({
    id: String(t.id || ''),
    displayName: String(t.displayName || 'Docente'),
    color: String(t.color || '#007DC5'),
  }));

  const payload: Record<string, unknown> = {
    institutionName: String(snapshot.metadata.institutionName || 'Institución Educativa Villa Flora').slice(0, 200),
    academicPeriod: String(snapshot.metadata.academicPeriod || '3° Periodo').slice(0, 100),
    academicWeek: Math.max(1, Math.min(52, Math.round(Number(snapshot.metadata.academicWeek || 8)))),
    lastUpdated: String(snapshot.metadata.lastUpdated || new Date().toLocaleString('es-CO')).slice(0, 100),
    shortCode: String(shortCode || 'vf').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'vf',
    timeBlocks: sanitizedBlocks,
    teachers: sanitizedTeachers,
    updatedAt: serverTimestamp(),
  };

  if (shortUrl && shortUrl.length <= 300) {
    payload.shortUrl = shortUrl;
  }

  try {
    await setDoc(doc(db, SCHEDULE_COLLECTION, OFFICIAL_DOC_ID), payload);
    localStorage.setItem(LAST_FETCH_KEY, String(Date.now()));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export function subscribeToPublishedSchedule(
  onUpdate: (data: CloudPublishedScheduleData) => void,
  _forceRefresh = false
): () => void {
  const docPath = `${SCHEDULE_COLLECTION}/${OFFICIAL_DOC_ID}`;

  try {
    const cachedRaw = localStorage.getItem('ievf_public_schedule_snapshot');
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw) as CloudPublishedScheduleData;
      if (cachedData && Array.isArray(cachedData.timeBlocks) && cachedData.timeBlocks.length > 0) {
        onUpdate(cachedData);
      }
    }
  } catch {
    // Ignorar error de lectura de caché inicial
  }

  const unsubscribe = onSnapshot(
    doc(db, SCHEDULE_COLLECTION, OFFICIAL_DOC_ID),
    (snapshot) => {
      if (!snapshot.exists()) return;
      const raw = snapshot.data();
      if (!raw || !Array.isArray(raw.timeBlocks)) return;

      let extractedDayConfigs: PublicDayConfigs | undefined;
      const cleanBlocks = raw.timeBlocks.filter((b: any) => {
        if (b && b.id === DAY_CONFIG_BLOCK_ID) {
          try {
            extractedDayConfigs = JSON.parse(b.subject);
          } catch {
            // ignore
          }
          return false;
        }
        return true;
      });

      const resolvedConfigs = resolveEffectiveDayConfigs(extractedDayConfigs);

      const parsed: CloudPublishedScheduleData = {
        metadata: {
          institutionName: raw.institutionName || 'Institución Educativa Villa Flora',
          academicPeriod: raw.academicPeriod || '3° Periodo',
          academicWeek: Number(raw.academicWeek || 8),
          lastUpdated: raw.lastUpdated || 'Sincronizado',
          totalBlocks: cleanBlocks.length,
          totalTeachers: Array.isArray(raw.teachers) ? raw.teachers.length : 0,
        },
        timeBlocks: cleanBlocks,
        teachers: Array.isArray(raw.teachers) ? raw.teachers : [],
        dayConfigs: resolvedConfigs,
        shortUrl: raw.shortUrl,
        shortCode: raw.shortCode,
      };

      try {
        localStorage.setItem('ievf_public_schedule_snapshot', JSON.stringify(parsed));
        localStorage.setItem(LAST_FETCH_KEY, String(Date.now()));
        if (extractedDayConfigs) {
          if (extractedDayConfigs.meetingDays) {
            localStorage.setItem('ievf_meeting_days', JSON.stringify(extractedDayConfigs.meetingDays));
          }
          if (extractedDayConfigs.eventDays) {
            localStorage.setItem('ievf_event_days', JSON.stringify(extractedDayConfigs.eventDays));
          }
          if (Array.isArray(extractedDayConfigs.customHolidays)) {
            localStorage.setItem('ievf_custom_holidays', JSON.stringify(extractedDayConfigs.customHolidays));
          }
        }
        if (raw.lastUpdated) {
          localStorage.setItem('ievf_last_published_at', raw.lastUpdated);
        }
        if (raw.shortUrl) {
          localStorage.setItem('ievf_active_short_url', raw.shortUrl);
        }
      } catch {
        // Ignore storage quota errors
      }

      onUpdate(parsed);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  );

  return () => {
    unsubscribe();
  };
}
