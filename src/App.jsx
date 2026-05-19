import Login from './components/auth/Login.jsx';
import StudentDashboard from './components/student/StudentDashboard.jsx';
import TeacherDashboard from './components/teacher/TeacherDashboard.jsx';
import useMockSession from './hooks/useMockSession.js';

function App() {
  const { session, login, logout } = useMockSession();

  if (!session) {
    return <Login onLogin={login} />;
  }

  if (session.role === 'student') {
    return <StudentDashboard session={session} onLogout={logout} />;
  }

  return <TeacherDashboard session={session} onLogout={logout} />;
}

export default App;
