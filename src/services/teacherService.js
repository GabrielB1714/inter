import { faculties } from '../mockData/faculties.js';
import { studentsWithAcademicContext } from '../mockData/students.js';
import { teachers } from '../mockData/teachers.js';
import { calculateAttendance, calculateAverage } from '../utils/academicCalculations.js';

export function getFacultyStructure() {
  return faculties;
}

export function getTeacherByEmail(email) {
  return teachers.find((teacher) => teacher.email === email) ?? null;
}

export function getStudentsForTeacher(teacher, searchId = '') {
  if (!teacher) return [];

  return studentsWithAcademicContext.filter((student) => {
    const inArea =
      student.faculty === teacher.faculty &&
      student.program === teacher.program &&
      teacher.courses.includes(student.course);
    const matchId = !searchId || student.id.includes(searchId.trim());
    return inArea && matchId;
  });
}

export function calculateAcademicPreview(gradesInput, totalClassesInput, absencesInput) {
  const parsedGrades = gradesInput
    .split(',')
    .map((grade) => Number(grade.trim()))
    .filter((grade) => !Number.isNaN(grade));

  return {
    average: calculateAverage(parsedGrades),
    attendance: calculateAttendance(Number(totalClassesInput), Number(absencesInput)),
  };
}
