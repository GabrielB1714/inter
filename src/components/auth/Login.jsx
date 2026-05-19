import { useMemo, useState } from 'react';
import { authenticateUser } from '../../services/authService.js';

const roles = {
  student: {
    title: 'Estudiante',
    description: 'Consulta tu trayectoria, alertas preventivas y materias que requieren refuerzo.',
    userLabel: 'ID institucional',
    userPlaceholder: 'Ej. 2024001',
  },
  teacher: {
    title: 'Profesor',
    description: 'Identifica estudiantes con riesgo académico y actualiza notas y faltas del curso.',
    userLabel: 'Correo institucional',
    userPlaceholder: 'nombre@universidad.edu.co',
  },
};

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [validationMessage, setValidationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const roleConfig = useMemo(() => roles[selectedRole], [selectedRole]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await authenticateUser(selectedRole, credentials.username, credentials.password);
    setLoading(false);

    if (!result.ok) {
      setValidationMessage(result.message);
      return;
    }

    setValidationMessage('');
    onLogin(result.user);
  };

  return (<main className="login-page"> <section className="login-hero"><span className="institution-pill">Universidad · Permanencia académica</span><h1>Predicción temprana de riesgo académico</h1></section>
    <section className="login-panel" aria-labelledby="login-title"><div className="panel-heading"><span className="eyebrow">Acceso institucional</span><h2 id="login-title">Selecciona tu perfil</h2></div>
    <div className="role-selector" role="tablist" aria-label="Tipo de usuario">{Object.entries(roles).map(([roleKey, role]) => (<button className={selectedRole === roleKey ? 'role-card active' : 'role-card'} key={roleKey} type="button" onClick={() => setSelectedRole(roleKey)} aria-pressed={selectedRole === roleKey}><strong>{role.title}</strong><small>{role.description}</small></button>))}</div>
    <form className="login-form" onSubmit={handleSubmit}><label>{roleConfig.userLabel}<input type="text" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder={roleConfig.userPlaceholder} autoComplete="username" /></label>
    <label>Contraseña<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="••••••••" autoComplete="current-password" /></label>{validationMessage && <p className="form-alert">{validationMessage}</p>}<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Validando...' : `Entrar como ${roleConfig.title}`}</button></form></section></main>
  );
}

export default Login;
