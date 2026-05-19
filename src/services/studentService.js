import { studentsWithAcademicContext } from '../mockData/students.js';

export function getStudentById(studentId) {
  return studentsWithAcademicContext.find((student) => student.id === studentId) ?? null;
}
