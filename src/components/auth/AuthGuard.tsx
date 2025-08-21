'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/firebase/auth';

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { state } = useAuth();
  const { user, loading } = state;

  if (loading) {
    // You can replace this with a more sophisticated loading spinner
    return <p className="text-center">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-bold">Welcome!</h2>
        <p>Please log in with your Google account to continue.</p>
        <Button onClick={signInWithGoogle}>Login with Google</Button>
      </div>
    );
  }

  return <>{children}</>;
};
