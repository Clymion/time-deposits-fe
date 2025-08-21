'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signOut } from '@/lib/firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function Header() {
  const { state } = useAuth();
  const { user } = state;

  return (
    <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">Time Deposit App</h1>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button onClick={signInWithGoogle}>Sign In with Google</Button>
        )}
      </div>
    </header>
  );
}
