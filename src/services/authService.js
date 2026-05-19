import { students } from '../mockData/students.js';
import { teachers } from '../mockData/teachers.js';

const INSTITUTIONAL_DOMAIN = '@universidad.edu.co';

export function authenticateUser(role, username, password) {
  if (!username.trim() || !password.trim()) {
    return { ok: false, message: 'Ingresa las credenciales institucionales para continuar.' };
  }

  if (role === 'student') {
    const student = students.find((item) => item.id === username.trim() && item.password === password);
    if (!student) {
      return { ok: false, message: 'ID institucional o contraseña inválidos.' };
    }
    return { ok: true, user: { id: student.id, name: student.name, role: 'student' } };
  }

  const normalizedEmail = username.trim().toLowerCase();
  if (!normalizedEmail.endsWith(INSTITUTIONAL_DOMAIN)) {
    return { ok: false, message: 'Debe ingresar un correo institucional válido' };
  }

  const teacher = teachers.find((item) => item.email === normalizedEmail && item.password === password);
  if (!teacher) {
    return { ok: false, message: 'Correo institucional o contraseña inválidos.' };
  }

  return { ok: true, user: { id: teacher.id, name: teacher.name, email: teacher.email, role: 'teacher' } };
}
