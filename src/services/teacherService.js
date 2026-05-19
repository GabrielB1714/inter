/* global fetch, URLSearchParams */
import { calculateAttendance, calculateAverage } from '../utils/academicCalculations.js';

const API_BASE_URL = 'http://localhost:5000';

export function calculateAcademicPreview(gradesInput, totalClassesInput, absencesInput) {
  const parsedGrades = gradesInput
    .split(',')
    .map((grade) => Number(grade.trim()))
    .filter((grade) => !Number.isNaN(grade));

  return {
    grades: parsedGrades,
    average: calculateAverage(parsedGrades),
    attendance: calculateAttendance(Number(totalClassesInput), Number(absencesInput)),
  };
}

export async function getStudentsForTeacher(teacherEmail, searchId = '') {
  const params = new URLSearchParams({ teacher_email: teacherEmail });
  if (searchId.trim()) params.set('search_id', searchId.trim());

  try {
    const response = await fetch(`${API_BASE_URL}/teachers/students?${params.toString()}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data.error || 'No fue posible cargar estudiantes.' };
    }

    return { ok: true, data: data.students || [] };
  } catch {
    return { ok: false, message: 'No fue posible conectar con el servidor.' };
  }
}

export async function updateAcademicRecord(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/teachers/update-academic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data.error || 'No fue posible actualizar el registro académico.' };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, message: 'No fue posible conectar con el servidor.' };
  }
}
