import { academicHistoryByStudent } from './academicHistory.js';

export const students = [
  {
    id: '2024001', password: 'student123', name: 'Ana Rodríguez', faculty: 'Ingeniería', program: 'Ingeniería de Sistemas', course: 'Programación I',
    repeatedSubjects: 1, failedSubjects: 1, problematicSubjects: ['Programación I', 'Cálculo'], risk: 'Medio', status: 'Seguimiento sugerido',
  },
  {
    id: '2024002', password: 'student123', name: 'Juan Pérez', faculty: 'Ingeniería', program: 'Ingeniería de Sistemas', course: 'Bases de Datos',
    repeatedSubjects: 2, failedSubjects: 2, problematicSubjects: ['Bases de Datos', 'Física I'], risk: 'Alto', status: 'Intervención prioritaria',
  },
  {
    id: '2024003', password: 'student123', name: 'Laura Gómez', faculty: 'Ingeniería', program: 'Ingeniería Electrónica', course: 'Física I',
    repeatedSubjects: 0, failedSubjects: 0, problematicSubjects: ['Ninguna crítica'], risk: 'Bajo', status: 'Rendimiento estable',
  },
  {
    id: '2024004', password: 'student123', name: 'Miguel Torres', faculty: 'Ciencias Básicas', program: 'Matemáticas', course: 'Cálculo',
    repeatedSubjects: 3, failedSubjects: 3, problematicSubjects: ['Cálculo', 'Física I'], risk: 'Alto', status: 'Acompañamiento urgente',
  },
  {
    id: '2024005', password: 'student123', name: 'Camila Díaz', faculty: 'Ingeniería', program: 'Ingeniería de Sistemas', course: 'Programación I',
    repeatedSubjects: 1, failedSubjects: 1, problematicSubjects: ['Programación I'], risk: 'Medio', status: 'Monitoreo activo',
  },
  {
    id: '2024006', password: 'student123', name: 'Diego Rivas', faculty: 'Ciencias Económicas', program: 'Matemáticas', course: 'Cálculo',
    repeatedSubjects: 2, failedSubjects: 2, problematicSubjects: ['Cálculo'], risk: 'Medio', status: 'Refuerzo recomendado',
  },
  {
    id: '2024007', password: 'student123', name: 'Sara Vélez', faculty: 'Ingeniería', program: 'Ingeniería Electrónica', course: 'Física I',
    repeatedSubjects: 1, failedSubjects: 1, problematicSubjects: ['Física I'], risk: 'Medio', status: 'Seguimiento docente',
  },
  {
    id: '2024008', password: 'student123', name: 'Andrés Molina', faculty: 'Ciencias Básicas', program: 'Matemáticas', course: 'Cálculo',
    repeatedSubjects: 2, failedSubjects: 2, problematicSubjects: ['Cálculo', 'Programación I'], risk: 'Alto', status: 'Intervención sugerida',
  },
];

export const studentsWithAcademicContext = students.map((student) => {
  const semesterHistory = academicHistoryByStudent[student.id] ?? [];
  const latest = semesterHistory[semesterHistory.length - 1] ?? { average: 0, totalClasses: 0, absences: 0 };

  return {
    ...student,
    semesterHistory,
    generalAverage: latest.average,
    totalClasses: latest.totalClasses,
    absences: latest.absences,
    attendance: latest.totalClasses > 0 ? Number((((latest.totalClasses - latest.absences) / latest.totalClasses) * 100).toFixed(1)) : 0,
    academicDrop: semesterHistory.length >= 2 ? semesterHistory[semesterHistory.length - 1].average < semesterHistory[semesterHistory.length - 2].average : false,
  };
});
