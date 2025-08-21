'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

type State = {
  user: User | null;
  loading: boolean;
};

const initialState: State = {
  user: null,
  loading: true,
};

const AuthContext = createContext<{ state: State }>({
  state: initialState,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((state: State, action: Partial<State>) => {
    return { ...state, ...action };
  }, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ user, loading: false });
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ state }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
