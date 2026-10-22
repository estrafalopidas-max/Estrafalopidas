import { TimeBlockEntity, DayOfWeek, TimeBlockType, classifyBlockType } from '../../domain/entities/time-block.entity';
import { GradeEntity, ShiftType } from '../../domain/entities/grade.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { ClassroomEntity } from '../../domain/entities/classroom.entity';
import { AbsenceRequestEntity } from '../../domain/entities/absence-request.entity';
import { getNextAvailableTeacherColor } from '../../domain/services/teacher-color.service';
import { getSubjectShortName } from '../../domain/constants/subjects';
import excelSeedData from './excel-seed-data.json';

const RAW_SEED_TEACHERS: Omit<UserEntity, 'maxWeeklyHours' | 'allowedSubjects'>[] = [
  {
    "id": "t-alejandro",
    "email": "alejandro@ievillaflora.edu.co",
    "displayName": "Alejandro",
    "role": "teacher",
    "documentId": "71234001",
    "phone": "3001001001",
    "subjects": [
      "Inglés",
      "Laboratorio de Inglés"
    ],
    "specialty": [
      "Inglés",
      "Laboratorio de Inglés"
    ],
    "assignedSubject": "Inglés",
    "subject": "Inglés",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-jairo-andres",
    "email": "jairo.andres@ievillaflora.edu.co",
    "displayName": "Jairo Andrés",
    "role": "teacher",
    "documentId": "71234002",
    "phone": "3001001002",
    "subjects": [
      "Ciencias Naturales",
      "Cátedra de Paz"
    ],
    "specialty": [
      "Ciencias Naturales",
      "Cátedra de Paz"
    ],
    "assignedSubject": "Ciencias Naturales",
    "subject": "Ciencias Naturales",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-laura",
    "email": "laura@ievillaflora.edu.co",
    "displayName": "Laura",
    "role": "teacher",
    "documentId": "71234003",
    "phone": "3001001003",
    "subjects": [
      "Ética y Valores",
      "Educación Religiosa"
    ],
    "specialty": [
      "Ética y Valores",
      "Educación Religiosa"
    ],
    "assignedSubject": "Ética y Valores",
    "subject": "Ética y Valores",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-claudia",
    "email": "claudia@ievillaflora.edu.co",
    "displayName": "Claudia",
    "role": "teacher",
    "documentId": "71234004",
    "phone": "3001001004",
    "subjects": [
      "Estadística",
      "Matemáticas"
    ],
    "specialty": [
      "Estadística",
      "Matemáticas"
    ],
    "assignedSubject": "Estadística",
    "subject": "Estadística",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-betty",
    "email": "betty@ievillaflora.edu.co",
    "displayName": "Betty",
    "role": "teacher",
    "documentId": "71234005",
    "phone": "3001001005",
    "subjects": [
      "Lengua Castellana",
      "Literatura"
    ],
    "specialty": [
      "Lengua Castellana",
      "Literatura"
    ],
    "assignedSubject": "Lengua Castellana",
    "subject": "Lengua Castellana",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-diego",
    "email": "diego@ievillaflora.edu.co",
    "displayName": "Diego",
    "role": "teacher",
    "documentId": "71234006",
    "phone": "3001001006",
    "subjects": [
      "Tecnología e Informática",
      "Cátedra de Paz"
    ],
    "specialty": [
      "Tecnología e Informática",
      "Cátedra de Paz"
    ],
    "assignedSubject": "Tecnología e Informática",
    "subject": "Tecnología e Informática",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-linda",
    "email": "linda@ievillaflora.edu.co",
    "displayName": "Linda",
    "role": "teacher",
    "documentId": "71234007",
    "phone": "3001001007",
    "subjects": [
      "Educación Artística"
    ],
    "specialty": [
      "Educación Artística"
    ],
    "assignedSubject": "Educación Artística",
    "subject": "Educación Artística",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-m-isabel",
    "email": "m.isabel@ievillaflora.edu.co",
    "displayName": "M Isabel",
    "role": "teacher",
    "documentId": "71234008",
    "phone": "3001001008",
    "subjects": [
      "Literatura",
      "Lengua Castellana"
    ],
    "specialty": [
      "Literatura",
      "Lengua Castellana"
    ],
    "assignedSubject": "Literatura",
    "subject": "Literatura",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-lorena-l",
    "email": "lorena.l@ievillaflora.edu.co",
    "displayName": "Lorena L",
    "role": "teacher",
    "documentId": "71234009",
    "phone": "3001001009",
    "subjects": [
      "Estadística",
      "Matemáticas"
    ],
    "specialty": [
      "Estadística",
      "Matemáticas"
    ],
    "assignedSubject": "Estadística",
    "subject": "Estadística",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-701",
      "g-702"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-natalia",
    "email": "natalia@ievillaflora.edu.co",
    "displayName": "Natalia",
    "role": "teacher",
    "documentId": "71234010",
    "phone": "3001001010",
    "subjects": [
      "Inglés",
      "Laboratorio de Inglés"
    ],
    "specialty": [
      "Inglés",
      "Laboratorio de Inglés"
    ],
    "assignedSubject": "Inglés",
    "subject": "Inglés",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-lorena-m",
    "email": "lorena.m@ievillaflora.edu.co",
    "displayName": "Lorena M",
    "role": "teacher",
    "documentId": "71234011",
    "phone": "3001001011",
    "subjects": [
      "Matemáticas",
      "Física"
    ],
    "specialty": [
      "Matemáticas",
      "Física"
    ],
    "assignedSubject": "Matemáticas",
    "subject": "Matemáticas",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-katia",
    "email": "katia@ievillaflora.edu.co",
    "displayName": "Katia",
    "role": "teacher",
    "documentId": "71234012",
    "phone": "3001001012",
    "subjects": [
      "Ciencias Políticas y Económicas",
      "Ciencias Sociales"
    ],
    "specialty": [
      "Ciencias Políticas y Económicas",
      "Ciencias Sociales"
    ],
    "assignedSubject": "Ciencias Políticas y Económicas",
    "subject": "Ciencias Políticas y Económicas",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-diana",
    "email": "diana@ievillaflora.edu.co",
    "displayName": "Diana",
    "role": "teacher",
    "documentId": "71234013",
    "phone": "3001001013",
    "subjects": [
      "Geometría"
    ],
    "specialty": [
      "Geometría"
    ],
    "assignedSubject": "Geometría",
    "subject": "Geometría",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-eliana",
    "email": "eliana@ievillaflora.edu.co",
    "displayName": "Eliana",
    "role": "teacher",
    "documentId": "71234014",
    "phone": "3001001014",
    "subjects": [
      "Ciencias Sociales",
      "Filosofía"
    ],
    "specialty": [
      "Ciencias Sociales",
      "Filosofía"
    ],
    "assignedSubject": "Ciencias Sociales",
    "subject": "Ciencias Sociales",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-701",
      "g-702",
      "g-801",
      "g-802"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-camilo",
    "email": "camilo@ievillaflora.edu.co",
    "displayName": "Camilo",
    "role": "teacher",
    "documentId": "71234015",
    "phone": "3001001015",
    "subjects": [
      "Educación Física"
    ],
    "specialty": [
      "Educación Física"
    ],
    "assignedSubject": "Educación Física",
    "subject": "Educación Física",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-601",
      "g-602",
      "g-701",
      "g-702",
      "g-801",
      "g-802",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-alejandra",
    "email": "alejandra@ievillaflora.edu.co",
    "displayName": "Alejandra",
    "role": "teacher",
    "documentId": "71234016",
    "phone": "3001001016",
    "subjects": [
      "Biología",
      "Ciencias Naturales",
      "Química"
    ],
    "specialty": [
      "Biología",
      "Ciencias Naturales",
      "Química"
    ],
    "assignedSubject": "Biología",
    "subject": "Biología",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101",
      "g-1102",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-omar",
    "email": "omar@ievillaflora.edu.co",
    "displayName": "Omar",
    "role": "teacher",
    "documentId": "71234017",
    "phone": "3001001017",
    "subjects": [
      "Cátedra de Paz",
      "Tecnología e Informática",
      "Media Técnica"
    ],
    "specialty": [
      "Cátedra de Paz",
      "Tecnología e Informática",
      "Media Técnica"
    ],
    "assignedSubject": "Cátedra de Paz",
    "subject": "Cátedra de Paz",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1101",
      "g-601",
      "g-602",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-alexander",
    "email": "alexander@ievillaflora.edu.co",
    "displayName": "Alexander",
    "role": "teacher",
    "documentId": "71234018",
    "phone": "3001001018",
    "subjects": [
      "Tecnología e Informática"
    ],
    "specialty": [
      "Tecnología e Informática"
    ],
    "assignedSubject": "Tecnología e Informática",
    "subject": "Tecnología e Informática",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1002",
      "g-1102",
      "g-901",
      "g-902"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-sara",
    "email": "sara@ievillaflora.edu.co",
    "displayName": "Sara",
    "role": "teacher",
    "documentId": "71234019",
    "phone": "3001001019",
    "subjects": [
      "Media Técnica"
    ],
    "specialty": [
      "Media Técnica"
    ],
    "assignedSubject": "Media Técnica",
    "subject": "Media Técnica",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1002",
      "g-1102"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-paola",
    "email": "paola@ievillaflora.edu.co",
    "displayName": "Paola",
    "role": "teacher",
    "documentId": "71234020",
    "phone": "3001001020",
    "subjects": [
      "Media Técnica"
    ],
    "specialty": [
      "Media Técnica"
    ],
    "assignedSubject": "Media Técnica",
    "subject": "Media Técnica",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1101"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-javier",
    "email": "javier@ievillaflora.edu.co",
    "displayName": "Javier",
    "role": "teacher",
    "documentId": "71234021",
    "phone": "3001001021",
    "subjects": [
      "Media Técnica"
    ],
    "specialty": [
      "Media Técnica"
    ],
    "assignedSubject": "Media Técnica",
    "subject": "Media Técnica",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1002",
      "g-1102"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-lizhet",
    "email": "lizhet@ievillaflora.edu.co",
    "displayName": "Lizhet",
    "role": "teacher",
    "documentId": "71234022",
    "phone": "3001001022",
    "subjects": [
      "Estadística",
      "Matemáticas"
    ],
    "specialty": [
      "Estadística",
      "Matemáticas"
    ],
    "assignedSubject": "Estadística",
    "subject": "Estadística",
    "academicLevel": "bachillerato",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-1001",
      "g-1002",
      "g-1101"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-101",
    "email": "titular.101@ievillaflora.edu.co",
    "displayName": "Docente Titular 1.1",
    "role": "teacher",
    "documentId": "43501001",
    "phone": "3102001001",
    "subjects": [
      "Ciencias Sociales",
      "Ética y Valores",
      "Estadística",
      "Educación Religiosa",
      "Plan Lector",
      "Matemáticas",
      "Inglés",
      "Educación Artística",
      "Lengua Castellana",
      "Geometría",
      "Ciencias Naturales",
      "Tecnología e Informática",
      "Educación Física"
    ],
    "specialty": [
      "Ciencias Sociales",
      "Ética y Valores",
      "Estadística",
      "Educación Religiosa",
      "Plan Lector",
      "Matemáticas",
      "Inglés",
      "Educación Artística",
      "Lengua Castellana",
      "Geometría",
      "Ciencias Naturales",
      "Tecnología e Informática",
      "Educación Física"
    ],
    "assignedSubject": "Ciencias Sociales",
    "subject": "Ciencias Sociales",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-101"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-102",
    "email": "titular.102@ievillaflora.edu.co",
    "displayName": "Docente Titular 1.2",
    "role": "teacher",
    "documentId": "43501002",
    "phone": "3102001002",
    "subjects": [
      "Ciencias Sociales",
      "Ética y Valores",
      "Estadística",
      "Educación Religiosa",
      "Plan Lector",
      "Matemáticas",
      "Inglés",
      "Educación Artística",
      "Lengua Castellana",
      "Geometría",
      "Ciencias Naturales",
      "Tecnología e Informática",
      "Educación Física"
    ],
    "specialty": [
      "Ciencias Sociales",
      "Ética y Valores",
      "Estadística",
      "Educación Religiosa",
      "Plan Lector",
      "Matemáticas",
      "Inglés",
      "Educación Artística",
      "Lengua Castellana",
      "Geometría",
      "Ciencias Naturales",
      "Tecnología e Informática",
      "Educación Física"
    ],
    "assignedSubject": "Ciencias Sociales",
    "subject": "Ciencias Sociales",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-102"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-201",
    "email": "titular.201@ievillaflora.edu.co",
    "displayName": "Docente Titular 2.1",
    "role": "teacher",
    "documentId": "43501003",
    "phone": "3102001003",
    "subjects": [
      "Educación Física",
      "Estadística",
      "Ética y Valores",
      "Educación Religiosa",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Tecnología e Informática",
      "Plan Lector",
      "Inglés",
      "Ciencias Naturales",
      "Geometría",
      "Educación Artística"
    ],
    "specialty": [
      "Educación Física",
      "Estadística",
      "Ética y Valores",
      "Educación Religiosa",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Tecnología e Informática",
      "Plan Lector",
      "Inglés",
      "Ciencias Naturales",
      "Geometría",
      "Educación Artística"
    ],
    "assignedSubject": "Educación Física",
    "subject": "Educación Física",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-201"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-202",
    "email": "titular.202@ievillaflora.edu.co",
    "displayName": "Docente Titular 2.2",
    "role": "teacher",
    "documentId": "43501004",
    "phone": "3102001004",
    "subjects": [
      "Educación Física",
      "Estadística",
      "Ética y Valores",
      "Educación Religiosa",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Plan Lector",
      "Tecnología e Informática",
      "Inglés",
      "Ciencias Naturales",
      "Geometría",
      "Educación Artística"
    ],
    "specialty": [
      "Educación Física",
      "Estadística",
      "Ética y Valores",
      "Educación Religiosa",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Plan Lector",
      "Tecnología e Informática",
      "Inglés",
      "Ciencias Naturales",
      "Geometría",
      "Educación Artística"
    ],
    "assignedSubject": "Educación Física",
    "subject": "Educación Física",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-202"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-301",
    "email": "titular.301@ievillaflora.edu.co",
    "displayName": "Docente Titular 3.1",
    "role": "teacher",
    "documentId": "43501005",
    "phone": "3102001005",
    "subjects": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Religiosa",
      "Educación Física",
      "Educación Artística",
      "Tecnología e Informática"
    ],
    "specialty": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Religiosa",
      "Educación Física",
      "Educación Artística",
      "Tecnología e Informática"
    ],
    "assignedSubject": "Matemáticas",
    "subject": "Matemáticas",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-301"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-302",
    "email": "titular.302@ievillaflora.edu.co",
    "displayName": "Docente Titular 3.2",
    "role": "teacher",
    "documentId": "43501006",
    "phone": "3102001006",
    "subjects": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Religiosa",
      "Educación Física",
      "Educación Artística",
      "Tecnología e Informática"
    ],
    "specialty": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Religiosa",
      "Educación Física",
      "Educación Artística",
      "Tecnología e Informática"
    ],
    "assignedSubject": "Matemáticas",
    "subject": "Matemáticas",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-302"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-303",
    "email": "titular.303@ievillaflora.edu.co",
    "displayName": "Docente Titular 3.3",
    "role": "teacher",
    "documentId": "43501007",
    "phone": "3102001007",
    "subjects": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Física",
      "Educación Religiosa",
      "Tecnología e Informática"
    ],
    "specialty": [
      "Matemáticas",
      "Estadística",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Ética y Valores",
      "Geometría",
      "Inglés",
      "Educación Física",
      "Educación Religiosa",
      "Tecnología e Informática"
    ],
    "assignedSubject": "Matemáticas",
    "subject": "Matemáticas",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-303"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-401",
    "email": "titular.401@ievillaflora.edu.co",
    "displayName": "Docente Titular 4.1",
    "role": "teacher",
    "documentId": "43501008",
    "phone": "3102001008",
    "subjects": [
      "Ética y Valores",
      "Lengua Castellana",
      "Matemáticas",
      "Geometría",
      "Educación Física",
      "Estadística",
      "Tecnología e Informática",
      "Ciencias Naturales",
      "Educación Religiosa",
      "Inglés",
      "Ciencias Sociales",
      "Educación Artística"
    ],
    "specialty": [
      "Ética y Valores",
      "Lengua Castellana",
      "Matemáticas",
      "Geometría",
      "Educación Física",
      "Estadística",
      "Tecnología e Informática",
      "Ciencias Naturales",
      "Educación Religiosa",
      "Inglés",
      "Ciencias Sociales",
      "Educación Artística"
    ],
    "assignedSubject": "Ética y Valores",
    "subject": "Ética y Valores",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-401"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-402",
    "email": "titular.402@ievillaflora.edu.co",
    "displayName": "Docente Titular 4.2",
    "role": "teacher",
    "documentId": "43501009",
    "phone": "3102001009",
    "subjects": [
      "Ética y Valores",
      "Matemáticas",
      "Lengua Castellana",
      "Educación Artística",
      "Ciencias Naturales",
      "Educación Física",
      "Estadística",
      "Inglés",
      "Tecnología e Informática",
      "Geometría",
      "Educación Religiosa",
      "Ciencias Sociales"
    ],
    "specialty": [
      "Ética y Valores",
      "Matemáticas",
      "Lengua Castellana",
      "Educación Artística",
      "Ciencias Naturales",
      "Educación Física",
      "Estadística",
      "Inglés",
      "Tecnología e Informática",
      "Geometría",
      "Educación Religiosa",
      "Ciencias Sociales"
    ],
    "assignedSubject": "Ética y Valores",
    "subject": "Ética y Valores",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-402"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-501",
    "email": "titular.501@ievillaflora.edu.co",
    "displayName": "Docente Titular 5.1",
    "role": "teacher",
    "documentId": "43501010",
    "phone": "3102001010",
    "subjects": [
      "Ética y Valores",
      "Ciencias Naturales",
      "Educación Física",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Inglés",
      "Tecnología e Informática",
      "Estadística",
      "Geometría",
      "Educación Artística",
      "Educación Religiosa"
    ],
    "specialty": [
      "Ética y Valores",
      "Ciencias Naturales",
      "Educación Física",
      "Lengua Castellana",
      "Ciencias Sociales",
      "Matemáticas",
      "Inglés",
      "Tecnología e Informática",
      "Estadística",
      "Geometría",
      "Educación Artística",
      "Educación Religiosa"
    ],
    "assignedSubject": "Ética y Valores",
    "subject": "Ética y Valores",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-501"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-502",
    "email": "titular.502@ievillaflora.edu.co",
    "displayName": "Docente Titular 5.2",
    "role": "teacher",
    "documentId": "43501011",
    "phone": "3102001011",
    "subjects": [
      "Ética y Valores",
      "Educación Física",
      "Ciencias Naturales",
      "Matemáticas",
      "Lengua Castellana",
      "Inglés",
      "Ciencias Sociales",
      "Educación Artística",
      "Geometría",
      "Tecnología e Informática",
      "Estadística",
      "Educación Religiosa"
    ],
    "specialty": [
      "Ética y Valores",
      "Educación Física",
      "Ciencias Naturales",
      "Matemáticas",
      "Lengua Castellana",
      "Inglés",
      "Ciencias Sociales",
      "Educación Artística",
      "Geometría",
      "Tecnología e Informática",
      "Estadística",
      "Educación Religiosa"
    ],
    "assignedSubject": "Ética y Valores",
    "subject": "Ética y Valores",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-502"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-trans1",
    "email": "titular.trans1@ievillaflora.edu.co",
    "displayName": "Docente Titular Transición 1",
    "role": "teacher",
    "documentId": "43501012",
    "phone": "3102001012",
    "subjects": [
      "Dimensiones del Desarrollo",
      "Iniciación a la Lectoescritura",
      "Pre-Matemáticas",
      "Educación Artística"
    ],
    "specialty": [
      "Dimensiones del Desarrollo",
      "Iniciación a la Lectoescritura",
      "Pre-Matemáticas",
      "Educación Artística"
    ],
    "assignedSubject": "Dimensiones del Desarrollo",
    "subject": "Dimensiones del Desarrollo",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-trans-1"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  },
  {
    "id": "t-docente-trans2",
    "email": "titular.trans2@ievillaflora.edu.co",
    "displayName": "Docente Titular Transición 2",
    "role": "teacher",
    "documentId": "43501013",
    "phone": "3102001013",
    "subjects": [
      "Dimensiones del Desarrollo",
      "Iniciación a la Lectoescritura",
      "Pre-Matemáticas",
      "Educación Artística"
    ],
    "specialty": [
      "Dimensiones del Desarrollo",
      "Iniciación a la Lectoescritura",
      "Pre-Matemáticas",
      "Educación Artística"
    ],
    "assignedSubject": "Dimensiones del Desarrollo",
    "subject": "Dimensiones del Desarrollo",
    "academicLevel": "primaria",
    "academicAssignmentStatus": "assigned",
    "assignedGradeIds": [
      "g-trans-2"
    ],
    "isActive": true,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  }
];

export const SEED_TEACHERS: UserEntity[] = RAW_SEED_TEACHERS.map((t) => ({
  maxWeeklyHours: (t as any).maxWeeklyHours ?? 24,
  ...t,
  allowedSubjects: (t as any).allowedSubjects && (t as any).allowedSubjects.length > 0
    ? (t as any).allowedSubjects
    : (t.subjects || []).map((s) => getSubjectShortName(s)),
}));

export const SEED_CLASSROOMS: ClassroomEntity[] = [
  // Bachillerato Classrooms
  { id: 'aula-101', code: '101', name: 'Aula 101', capacity: 40, building: 'Bloque A', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-102', code: '102', name: 'Aula 102', capacity: 38, building: 'Bloque A', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-103', code: '103', name: 'Aula 103', capacity: 38, building: 'Bloque A', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-201', code: '201', name: 'Aula 201', capacity: 38, building: 'Bloque A', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-202', code: '202', name: 'Aula 202', capacity: 40, building: 'Bloque A', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-203', code: '203', name: 'Aula 203', capacity: 36, building: 'Bloque A', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-204', code: '204', name: 'Aula 204', capacity: 35, building: 'Bloque A', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-301', code: '301', name: 'Aula 301', capacity: 35, building: 'Bloque B', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-302', code: '302', name: 'Aula 302', capacity: 35, building: 'Bloque B', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-303', code: '303', name: 'Aula 303', capacity: 35, building: 'Bloque B', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-304', code: '304', name: 'Aula 304', capacity: 35, building: 'Bloque B', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-305', code: '305', name: 'Aula 305', capacity: 35, building: 'Bloque B', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-401', code: '401', name: 'Aula 401', capacity: 35, building: 'Bloque B', floor: 4, type: 'standard', isActive: true },
  { id: 'aula-402', code: '402', name: 'Aula 402', capacity: 35, building: 'Bloque B', floor: 4, type: 'standard', isActive: true },
  { id: 'aula-rota', code: 'ROTA', name: 'Aula (ROTACIÓN)', capacity: 35, building: 'Rotativa', floor: 1, type: 'standard', isActive: true },
  { id: 'lab-quimica', code: 'LAB-1', name: 'Lab. Ciencias y Química', capacity: 32, building: 'Bloque C', floor: 1, type: 'laboratory', isActive: true },
  { id: 'lab-fisica', code: 'LAB-2', name: 'Lab. Física', capacity: 32, building: 'Bloque C', floor: 1, type: 'laboratory', isActive: true },
  { id: 'sala-sistemas', code: 'SIS-1', name: 'Sala de Cómputo 1', capacity: 35, building: 'Bloque C', floor: 2, type: 'computer_lab', isActive: true },

  // Primaria Classrooms
  { id: 'aula-p-101', code: 'P-101', name: 'Aula P-101', capacity: 35, building: 'Bloque Primaria', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-p-102', code: 'P-102', name: 'Aula P-102', capacity: 35, building: 'Bloque Primaria', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-p-103', code: 'P-103', name: 'Aula P-103', capacity: 35, building: 'Bloque Primaria', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-p-201', code: 'P-201', name: 'Aula P-201', capacity: 35, building: 'Bloque Primaria', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-p-202', code: 'P-202', name: 'Aula P-202', capacity: 35, building: 'Bloque Primaria', floor: 1, type: 'standard', isActive: true },
  { id: 'aula-p-301', code: 'P-301', name: 'Aula P-301', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-302', code: 'P-302', name: 'Aula P-302', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-303', code: 'P-303', name: 'Aula P-303', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-304', code: 'P-304', name: 'Aula P-304', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-305', code: 'P-305', name: 'Aula P-305', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-401', code: 'P-401', name: 'Aula P-401', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-402', code: 'P-402', name: 'Aula P-402', capacity: 35, building: 'Bloque Primaria', floor: 2, type: 'standard', isActive: true },
  { id: 'aula-p-501', code: 'P-501', name: 'Aula P-501', capacity: 35, building: 'Bloque Primaria', floor: 3, type: 'standard', isActive: true },
  { id: 'aula-p-502', code: 'P-502', name: 'Aula P-502', capacity: 35, building: 'Bloque Primaria', floor: 3, type: 'standard', isActive: true },
];

/**
 * HOJA 1 DEL EXCEL: BACHILLERATO (12 GRADOS ESTRICTOS)
 * 6°1, 6°2, 7°1, 7°2, 8°1, 8°2, 9°1, 9°2, 10°1, 10°2, 11°1, 11°2
 * Cruce estricto de Aulas desde Excel:
 * 6°1 -> Aula 303 | 6°2 -> Aula 402 | 7°1 -> Aula 202 | 7°2 -> Aula 304
 * 8°1 -> Aula 401 | 8°2 -> Aula 302 | 9°1 -> Aula (ROTACIÓN) | 9°2 -> Aula 301
 * 10°1 -> Aula 201 | 10°2 -> Aula 102 | 11°1 -> Aula 103 | 11°2 -> Aula 305
 */
export const BACHILLERATO_GRADES: GradeEntity[] = [
  { id: 'g-601', gradeLevel: '6°', groupNumber: '1', fullName: '6°1', shift: 'morning', studentCount: 38, academicYear: 2026, defaultClassroomId: 'Aula 303', isActive: true },
  { id: 'g-602', gradeLevel: '6°', groupNumber: '2', fullName: '6°2', shift: 'morning', studentCount: 36, academicYear: 2026, defaultClassroomId: 'Aula 402', isActive: true },
  { id: 'g-701', gradeLevel: '7°', groupNumber: '1', fullName: '7°1', shift: 'morning', studentCount: 35, academicYear: 2026, defaultClassroomId: 'Aula 202', isActive: true },
  { id: 'g-702', gradeLevel: '7°', groupNumber: '2', fullName: '7°2', shift: 'morning', studentCount: 37, academicYear: 2026, defaultClassroomId: 'Aula 304', isActive: true },
  { id: 'g-801', gradeLevel: '8°', groupNumber: '1', fullName: '8°1', shift: 'morning', studentCount: 34, academicYear: 2026, defaultClassroomId: 'Aula 401', isActive: true },
  { id: 'g-802', gradeLevel: '8°', groupNumber: '2', fullName: '8°2', shift: 'morning', studentCount: 33, academicYear: 2026, defaultClassroomId: 'Aula 302', isActive: true },
  { id: 'g-901', gradeLevel: '9°', groupNumber: '1', fullName: '9°1', shift: 'morning', studentCount: 33, academicYear: 2026, defaultClassroomId: 'Aula (ROTACIÓN)', isActive: true },
  { id: 'g-902', gradeLevel: '9°', groupNumber: '2', fullName: '9°2', shift: 'morning', studentCount: 34, academicYear: 2026, defaultClassroomId: 'Aula 301', isActive: true },
  { id: 'g-1001', gradeLevel: '10°', groupNumber: '1', fullName: '10°1', shift: 'morning', studentCount: 32, academicYear: 2026, defaultClassroomId: 'Aula 201', isActive: true },
  { id: 'g-1002', gradeLevel: '10°', groupNumber: '2', fullName: '10°2', shift: 'morning', studentCount: 31, academicYear: 2026, defaultClassroomId: 'Aula 102', isActive: true },
  { id: 'g-1101', gradeLevel: '11°', groupNumber: '1', fullName: '11°1', shift: 'morning', studentCount: 30, academicYear: 2026, defaultClassroomId: 'Aula 103', isActive: true },
  { id: 'g-1102', gradeLevel: '11°', groupNumber: '2', fullName: '11°2', shift: 'morning', studentCount: 29, academicYear: 2026, defaultClassroomId: 'Aula 305', isActive: true },
];

/**
 * HOJA 2 DEL EXCEL: PRIMARIA (11 GRADOS ESTRICTOS)
 * 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2
 * Cruce estricto de Aulas desde Excel:
 * 1.1 -> Aula 102 | 1.2 -> Aula 103 | 2.1 -> Aula 402 | 2.2 -> Aula 401
 * 3.1 -> Aula 301 | 3.2 -> Aula 302 | 3.3 -> Aula 303 | 4.1 -> Aula 305
 * 4.2 -> Aula 304 | 5.1 -> Aula 201 | 5.2 -> Aula 202
 */
export const TRANSICION_2_GRADES: GradeEntity[] = [
  { id: 'g-trans-2', gradeLevel: 'Transición', groupNumber: '2', fullName: 'Transición 2', shift: 'afternoon', studentCount: 25, academicYear: 2026, defaultClassroomId: 'Aula P-101', isActive: true },
];

export const PRIMARIA_GRADES: GradeEntity[] = [
  ...TRANSICION_2_GRADES,
  { id: 'g-101', gradeLevel: '1°', groupNumber: '1', fullName: '1.1', shift: 'afternoon', studentCount: 32, academicYear: 2026, defaultClassroomId: 'Aula 102', isActive: true },
  { id: 'g-102', gradeLevel: '1°', groupNumber: '2', fullName: '1.2', shift: 'afternoon', studentCount: 30, academicYear: 2026, defaultClassroomId: 'Aula 103', isActive: true },
  { id: 'g-201', gradeLevel: '2°', groupNumber: '1', fullName: '2.1', shift: 'afternoon', studentCount: 33, academicYear: 2026, defaultClassroomId: 'Aula 402', isActive: true },
  { id: 'g-202', gradeLevel: '2°', groupNumber: '2', fullName: '2.2', shift: 'afternoon', studentCount: 31, academicYear: 2026, defaultClassroomId: 'Aula 401', isActive: true },
  { id: 'g-301', gradeLevel: '3°', groupNumber: '1', fullName: '3.1', shift: 'afternoon', studentCount: 35, academicYear: 2026, defaultClassroomId: 'Aula 301', isActive: true },
  { id: 'g-302', gradeLevel: '3°', groupNumber: '2', fullName: '3.2', shift: 'afternoon', studentCount: 34, academicYear: 2026, defaultClassroomId: 'Aula 302', isActive: true },
  { id: 'g-303', gradeLevel: '3°', groupNumber: '3', fullName: '3.3', shift: 'afternoon', studentCount: 32, academicYear: 2026, defaultClassroomId: 'Aula 303', isActive: true },
  { id: 'g-401', gradeLevel: '4°', groupNumber: '1', fullName: '4.1', shift: 'afternoon', studentCount: 36, academicYear: 2026, defaultClassroomId: 'Aula 305', isActive: true },
  { id: 'g-402', gradeLevel: '4°', groupNumber: '2', fullName: '4.2', shift: 'afternoon', studentCount: 35, academicYear: 2026, defaultClassroomId: 'Aula 304', isActive: true },
  { id: 'g-501', gradeLevel: '5°', groupNumber: '1', fullName: '5.1', shift: 'afternoon', studentCount: 34, academicYear: 2026, defaultClassroomId: 'Aula 201', isActive: true },
  { id: 'g-502', gradeLevel: '5°', groupNumber: '2', fullName: '5.2', shift: 'afternoon', studentCount: 33, academicYear: 2026, defaultClassroomId: 'Aula 202', isActive: true },
];

export const TRANSICION_1_GRADES: GradeEntity[] = [
  { id: 'g-trans-1', gradeLevel: 'Transición', groupNumber: '1', fullName: 'Transición 1', shift: 'transicion-1', studentCount: 26, academicYear: 2026, defaultClassroomId: 'Aula P-102', isActive: true },
];

export const SEED_GRADES: GradeEntity[] = [
  ...BACHILLERATO_GRADES,
  ...PRIMARIA_GRADES,
  ...TRANSICION_1_GRADES,
];

export const SEED_ABSENCE_REQUESTS: AbsenceRequestEntity[] = [
  {
    id: 'abs-req-001',
    teacher_id: 't-carlos-mendoza',
    teacher_name: 'Carlos Mendoza',
    date: '2026-10-19',
    status: 'approved',
    reason: 'Cita médica especialista EPS Sura',
    created_at: '2026-10-16T14:30:00Z',
    reviewed_by: 'Coord. Académica María Elena Restrepo',
    reviewed_at: '2026-10-16T15:00:00Z',
    affected_periods: [1, 2],
    replacement_teacher_id: 't-sofia-ospina',
    replacement_teacher_name: 'Sofía Ospina',
    review_notes: 'Aprobado. Se asigna Prof. Sofía para guardia en periodo 1.',
  },
  {
    id: 'abs-req-002',
    teacher_id: 't-andres-giraldo',
    teacher_name: 'Andrés Giraldo',
    date: '2026-10-20',
    status: 'pending',
    reason: 'Capacitación Secretaría de Educación - Laboratorios STEM',
    created_at: '2026-10-16T18:15:00Z',
    reviewed_by: null,
    reviewed_at: null,
    affected_periods: [3, 4, 5],
    replacement_teacher_id: null,
    review_notes: null,
  },
  {
    id: 'abs-req-003',
    teacher_id: 't-diego-henao',
    teacher_name: 'Diego Henao',
    date: '2026-10-21',
    status: 'pending',
    reason: 'Calamidad doméstica justificada',
    created_at: '2026-10-16T19:00:00Z',
    reviewed_by: null,
    reviewed_at: null,
    affected_periods: [1, 2, 3, 4, 5, 6],
    replacement_teacher_id: null,
    review_notes: null,
  },
];

export function generateSeedBlocks(): TimeBlockEntity[] {
  const baseBlocks: TimeBlockEntity[] =
    Array.isArray(excelSeedData) && excelSeedData.length > 0
      ? ([...excelSeedData] as TimeBlockEntity[])
      : [];

  const days: DayOfWeek[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const blocks: TimeBlockEntity[] = [];

  const bachilleratoSubjectRotation = [
    { subject: 'Matemáticas', teacherId: 't-carlos-mendoza', teacherName: 'Carlos Mendoza' },
    { subject: 'Lengua Castellana', teacherId: 't-laura-restrepo', teacherName: 'Laura Restrepo' },
    { subject: 'Ciencias Naturales', teacherId: 't-andres-giraldo', teacherName: 'Andrés Giraldo' },
    { subject: 'Inglés', teacherId: 't-sofia-ospina', teacherName: 'Sofía Ospina' },
    { subject: 'Ciencias Sociales', teacherId: 't-diego-henao', teacherName: 'Diego Henao' },
    { subject: 'Educación Física', teacherId: 't-valentina-cano', teacherName: 'Valentina Cano' },
    { subject: 'Tecnología', teacherId: 't-mateo-arango', teacherName: 'Mateo Arango' },
    { subject: 'Educación Artística', teacherId: 't-isabel-zuluaga', teacherName: 'Isabel Zuluaga' },
    { subject: 'Filosofía', teacherId: 't-alejandro-restrepo', teacherName: 'ALEJANDRO RESTREPO' },
  ];

  const primariaSubjectRotation = [
    { subject: 'Lengua Castellana y Lectoescritura', teacherId: 't-diana-velez', teacherName: 'Diana Marcela Vélez' },
    { subject: 'Matemáticas Básicas', teacherId: 't-carlos-mendoza', teacherName: 'Carlos Mendoza' },
    { subject: 'Ciencias Naturales y Medio Ambiente', teacherId: 't-andres-giraldo', teacherName: 'Andrés Giraldo' },
    { subject: 'Inglés Elemental', teacherId: 't-sofia-ospina', teacherName: 'Sofía Ospina' },
    { subject: 'Ciencias Sociales e Historia', teacherId: 't-diego-henao', teacherName: 'Diego Henao' },
    { subject: 'Educación Física y Recreación', teacherId: 't-valentina-cano', teacherName: 'Valentina Cano' },
    { subject: 'Informática y Robótica Infantil', teacherId: 't-mateo-arango', teacherName: 'Mateo Arango' },
    { subject: 'Educación Artística Infantil', teacherId: 't-isabel-zuluaga', teacherName: 'Isabel Zuluaga' },
  ];

  const morningPeriods = [
    { period: 1, startTime: '06:10', endTime: '07:05' },
    { period: 2, startTime: '07:05', endTime: '08:00' },
    { period: 3, startTime: '08:00', endTime: '08:55' },
    { period: 4, startTime: '09:25', endTime: '10:20' },
    { period: 5, startTime: '10:20', endTime: '11:15' },
    { period: 6, startTime: '11:15', endTime: '12:10' },
    { period: 7, startTime: '12:40', endTime: '13:35' },
    { period: 8, startTime: '13:35', endTime: '14:30' },
    { period: 9, startTime: '14:30', endTime: '15:25' },
    { period: 10, startTime: '15:45', endTime: '16:40' },
    { period: 11, startTime: '16:40', endTime: '17:35' },
  ];

  const afternoonPeriods = [
    { period: 1, startTime: '12:30', endTime: '13:25' },
    { period: 2, startTime: '13:25', endTime: '14:20' },
    { period: 3, startTime: '14:20', endTime: '15:15' },
    { period: 4, startTime: '15:45', endTime: '16:40' },
    { period: 5, startTime: '16:40', endTime: '17:35' },
  ];

  SEED_GRADES.forEach((grade, gIdx) => {
    const isBachillerato = grade.shift === 'morning';
    const periods = isBachillerato ? morningPeriods : afternoonPeriods;
    const subjectRotation = isBachillerato ? bachilleratoSubjectRotation : primariaSubjectRotation;
    const defaultClassroom = SEED_CLASSROOMS[gIdx % SEED_CLASSROOMS.length];
    const isSeniorHigh = grade.fullName.startsWith('10') || grade.fullName.startsWith('11');

    days.forEach((day, dIdx) => {
      periods.forEach((pDef) => {
        let block_type: TimeBlockType = 'class';
        let subject = '';
        let teacherId = '';
        let teacherName = '';

        if (isBachillerato && pDef.period > 6) {
          if (isSeniorHigh) {
            // Media Técnica (10° y 11°)
            block_type = 'technical_media';
            subject = grade.fullName.startsWith('10')
              ? 'MEDIA TÉCNICA (Desarrollo de Software)'
              : 'MEDIA TÉCNICA (Redes y Telecomunicaciones)';
            teacherId = 't-mateo-arango';
            teacherName = 'Mateo Arango';
          } else {
            // Bachillerato regular (6° a 9°) sin asignación académica en jornada tarde
            block_type = 'exit';
            subject = 'No disponible';
            teacherId = 'unassigned';
            teacherName = 'Sin Asignar';
          }
        } else {
          // Regular class periods (1 to 6 in Bachillerato and 1 to 6 in Primaria)
          const itemIdx = (gIdx * 2 + dIdx + pDef.period) % subjectRotation.length;
          const subj = subjectRotation[itemIdx];
          block_type = 'class';
          subject = subj.subject;
          teacherId = subj.teacherId;
          teacherName = subj.teacherName;
        }

        let status: TimeBlockEntity['status'] = 'regular';
        let absenceRequestId: string | null = null;
        let replacementTeacherId: string | null = null;
        let replacementTeacherName: string | null = null;
        let notes: string | null = null;

        // Demonstration data: on Monday, Carlos Mendoza is absent in 10-1
        if (day === 'lunes' && grade.id === 'g-1001' && teacherId === 't-carlos-mendoza') {
          if (pDef.period === 1) {
            status = 'covered';
            absenceRequestId = 'abs-req-001';
            replacementTeacherId = 't-sofia-ospina';
            replacementTeacherName = 'Sofía Ospina';
            notes = 'Cubierto por reemplazo: Sofía Ospina';
          } else if (pDef.period === 2) {
            status = 'absent';
            absenceRequestId = 'abs-req-001';
            notes = 'Docente con ausencia médica justificada';
          }
        }

        blocks.push({
          id: `tb-${grade.id}-${day}-p${pDef.period}`,
          block_type,
          dayOfWeek: day,
          period: pDef.period,
          startTime: pDef.startTime,
          endTime: pDef.endTime,
          shift: grade.shift,
          gradeId: grade.id,
          gradeName: grade.fullName,
          subject,
          teacherId,
          teacherName,
          classroomId: defaultClassroom.id,
          classroomName: defaultClassroom.name,
          status,
          absenceRequestId,
          replacementTeacherId,
          replacementTeacherName,
          notes,
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });

  if (baseBlocks.length > 0) {
    const existingGradeIds = new Set(baseBlocks.map((b) => b.gradeId));
    const missingGradesBlocks = blocks.filter((b) => !existingGradeIds.has(b.gradeId));
    return [...baseBlocks, ...missingGradesBlocks];
  }

  return blocks;
}

// Asignación de Paleta Curada Anti-Colisión (Selección sin Reemplazo de VILLA_FLORA_PALETTE)
const usedSeedColors: string[] = [];

// 1. Prioridad: Parche de Datos Inmediato para Alejandro, Jairo y Claudia
SEED_TEACHERS.forEach((teacher) => {
  const normId = teacher.id.toLowerCase();
  const normName = teacher.displayName.toLowerCase();

  if (normId.includes('alejandro') || normName.includes('alejandro')) {
    teacher.color = '#1E3A8A'; // Azul Oscuro
    teacher.color_hex = '#1E3A8A';
    teacher.avatarColor = '#1E3A8A';
  } else if (normId.includes('jairo') || normName.includes('jairo')) {
    teacher.color = '#EA580C'; // Naranja
    teacher.color_hex = '#EA580C';
    teacher.avatarColor = '#EA580C';
  } else if (normId.includes('claudia') || normName.includes('claudia')) {
    teacher.color = '#34D399'; // Verde Menta
    teacher.color_hex = '#34D399';
    teacher.avatarColor = '#34D399';
  }

  if (teacher.color_hex) {
    usedSeedColors.push(teacher.color_hex);
  }
});

// 2. Asignación Anti-Colisión sin reemplazo para los demás docentes
SEED_TEACHERS.forEach((teacher) => {
  if (!teacher.color_hex) {
    const nextColor = getNextAvailableTeacherColor(usedSeedColors);
    teacher.color = nextColor;
    teacher.color_hex = nextColor;
    teacher.avatarColor = nextColor;
    usedSeedColors.push(nextColor);
  }
});

export function ensureSeedDataLoaded() {
  const isV16 = localStorage.getItem('ievf_seed_version') === 'v16';

  if (!isV16 || !localStorage.getItem('ievf_users_v1')) {
    localStorage.setItem('ievf_users_v1', JSON.stringify(SEED_TEACHERS));
  } else {
    try {
      const raw = localStorage.getItem('ievf_users_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const upgraded = parsed.map((t: any) => ({
            ...t,
            maxWeeklyHours:
              !t.maxWeeklyHours || t.maxWeeklyHours === 22 || t.maxWeeklyHours === 25
                ? 24
                : t.maxWeeklyHours,
          }));
          localStorage.setItem('ievf_users_v1', JSON.stringify(upgraded));
        }
      }
    } catch (e) {
      console.warn('[ensureSeedDataLoaded] Error migrando usuarios:', e);
    }
  }
  if (!isV16 || !localStorage.getItem('ievf_classrooms_v1')) {
    localStorage.setItem('ievf_classrooms_v1', JSON.stringify(SEED_CLASSROOMS));
  }
  if (!isV16 || !localStorage.getItem('ievf_grades_v1')) {
    localStorage.setItem('ievf_grades_v1', JSON.stringify(SEED_GRADES));
  }
  if (!isV16 || !localStorage.getItem('ievf_absence_requests_v1')) {
    localStorage.setItem('ievf_absence_requests_v1', JSON.stringify(SEED_ABSENCE_REQUESTS));
  }
  if (!isV16 || (!localStorage.getItem('ievf_time_blocks_v1') && !localStorage.getItem('villaFloraMatrix'))) {
    const seedBlocks = generateSeedBlocks();
    localStorage.setItem('ievf_time_blocks_v1', JSON.stringify(seedBlocks));
    localStorage.setItem('villaFloraMatrix', JSON.stringify(seedBlocks));
  } else if (!localStorage.getItem('villaFloraMatrix')) {
    const existing = localStorage.getItem('ievf_time_blocks_v1');
    if (existing) {
      localStorage.setItem('villaFloraMatrix', existing);
    }
  }

  localStorage.setItem('ievf_seed_version', 'v16');
}
