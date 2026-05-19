import { useState } from 'react';

function useMockSession() {
  const [session, setSession] = useState(null);

  const login = (user) => {
    setSession({ ...user, authenticatedAt: new Date().toISOString() });
  };

  const logout = () => {
    setSession(null);
  };

  return { session, login, logout };
}

export default useMockSession;
