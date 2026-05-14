import { useMemo, useState } from 'react';

const roles = {
  student: {
    title: 'Estudiante',
    description: 'Consulta tu trayectoria, alertas preventivas y materias que requieren refuerzo.',
    userLabel: 'ID institucional',
    userPlaceholder: 'Ej. 202410045',
  },
  teacher: {
    title: 'Profesor',
    description: 'Identifica estudiantes con riesgo académico y actualiza notas y faltas del curso.',
    userLabel: 'Correo institucional',
    userPlaceholder: 'profesor@universidad.edu',
  },
};

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [validationMessage, setValidationMessage] = useState('');

  const roleConfig = useMemo(() => roles[selectedRole], [selectedRole]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setValidationMessage('Ingresa las credenciales institucionales para continuar.');
      return;
    }

    setValidationMessage('');
    onLogin(selectedRole);
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <span className="institution-pill">Universidad · Permanencia académica</span>
        <h1>Predicción temprana de riesgo académico</h1>
        <p>
          Plataforma web para transformar señales académicas en alertas preventivas,
          seguimiento oportuno y decisiones de acompañamiento antes de que el riesgo aumente.
        </p>
        <div className="hero-stats" aria-label="Indicadores de propósito">
          <article>
            <strong>ML</strong>
            <span>Preparado para modelos predictivos</span>
          </article>
          <article>
            <strong>360°</strong>
            <span>Vista por estudiante, curso y programa</span>
          </article>
          <article>
            <strong>0%</strong>
            <span>Sin conexión backend en esta fase</span>
          </article>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="panel-heading">
          <span className="eyebrow">Acceso institucional</span>
          <h2 id="login-title">Selecciona tu perfil</h2>
        </div>

        <div className="role-selector" role="tablist" aria-label="Tipo de usuario">
          {Object.entries(roles).map(([roleKey, role]) => (
            <button
              className={selectedRole === roleKey ? 'role-card active' : 'role-card'}
              key={roleKey}
              type="button"
              onClick={() => setSelectedRole(roleKey)}
              aria-pressed={selectedRole === roleKey}
            >
              <strong>{role.title}</strong>
              <small>{role.description}</small>
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            {roleConfig.userLabel}
            <input
              type="text"
              value={credentials.username}
              onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
              placeholder={roleConfig.userPlaceholder}
              autoComplete="username"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {validationMessage && <p className="form-alert">{validationMessage}</p>}
          <button className="primary-button" type="submit">
            Entrar como {roleConfig.title}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
