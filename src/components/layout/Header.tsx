'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signOut } from '@/lib/firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { state } = useAuth();
  const { user } = state;

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">Time Deposit</h1>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user.displayName}</span>
            <Button onClick={signOut}>Logout</Button>
          </div>
        ) : (
          <Button onClick={signInWithGoogle}>Login with Google</Button>
        )}
      </div>
    </header>
  );
};
