'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { deleteGoal } from '@/lib/firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteGoalDialogProps {
  goalId: string;
  goalName: string;
  onGoalDeleted: () => void;
}

export const DeleteGoalDialog = ({ goalId, goalName, onGoalDeleted }: DeleteGoalDialogProps) => {
  const { state } = useAuth();
  const user = state.user;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!user) {
      console.error('User not authenticated');
      alert('Could not delete goal. You might be signed out. Please refresh and try again.');
      setIsOpen(false);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteGoal(user.uid, goalId);
      onGoalDeleted();
      setIsOpen(false); // Close dialog on success
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert(`Failed to delete goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsDeleting(false); // Only set deleting to false on error, to avoid flicker on success
    }
  }, [user, goalId, onGoalDeleted]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete &ldquo;{goalName}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your goal and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
