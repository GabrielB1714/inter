/* global fetch */
const API_BASE_URL = 'http://localhost:5000';

export async function authenticateUser(role, username, password) {
  if (!username.trim() || !password.trim()) {
    return { ok: false, message: 'Ingresa las credenciales institucionales para continuar.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, username: username.trim(), password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data.error || 'No fue posible iniciar sesión.' };
    }

    return { ok: true, user: data.user };
  } catch {
    return { ok: false, message: 'No fue posible conectar con el servidor.' };
  }
}
