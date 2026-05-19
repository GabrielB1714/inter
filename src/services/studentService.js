/* global fetch */
const API_BASE_URL = 'http://localhost:5000';

export async function getStudentById(studentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data.error || 'No fue posible cargar el perfil del estudiante.' };
    }

    return {
      ok: true,
      data: {
        ...data,
        problematicSubjects: data.problematicSubjects ?? ['Programación I', 'Cálculo'],
      },
    };
  } catch {
    return { ok: false, message: 'No fue posible conectar con el servidor.' };
  }
}
