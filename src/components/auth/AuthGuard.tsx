'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const { user, loading } = state;

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-8">Please sign in to continue.</p>;
  }

  return <>{children}</>;
}
