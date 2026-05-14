import { useState } from 'react';
import Login from './components/auth/Login.jsx';
import StudentDashboard from './components/student/StudentDashboard.jsx';
import TeacherDashboard from './components/teacher/TeacherDashboard.jsx';

function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (role) => {
    setSession({ role, authenticatedAt: new Date().toISOString() });
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  if (session.role === 'student') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  return <TeacherDashboard onLogout={handleLogout} />;
}

export default App;
