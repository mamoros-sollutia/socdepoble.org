import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../../data/backendPort.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [authTick, setAuthTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const onAuthChange = () => setAuthTick(t => t + 1);
    window.addEventListener('sdp:auth-change', onAuthChange);
    
    return () => {
      window.removeEventListener('sdp:auth-change', onAuthChange);
    };
  }, []);

  const currentUser = getCurrentUser();

  const value = {
    currentUser,
    authTick
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession ha de ser usat dins de SessionProvider');
  return context;
}
