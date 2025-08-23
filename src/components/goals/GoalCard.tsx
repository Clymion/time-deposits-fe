'use client';

import { Goal } from '@/types/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EditGoal } from './EditGoal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { deleteGoal } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  onGoalUpdated: () => void;
}

export const GoalCard = ({ goal, onGoalUpdated }: GoalCardProps) => {
  const { state } = useAuth();
  const user = state.user;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  const handleDelete = useCallback(async () => {
    if (!user) {
      console.error('User not authenticated');
      alert('Could not delete goal. You might be signed out. Please refresh and try again.');
      return;
    }
    setIsDeleting(true);
    try {
      await deleteGoal(user.uid, goal.id);
      onGoalUpdated(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert(`Failed to delete goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  }, [user, goal.id, onGoalUpdated]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <Card
        className="w-full transition-all hover:shadow-md flex flex-col h-full cursor-pointer gap-3"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle>{goal.goalName}</CardTitle>
          {goal.description && <CardDescription>{goal.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Current</span>
            <span className="font-bold">¥{goal.currentAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Target</span>
            <span className="font-bold">¥{goal.targetAmount.toLocaleString()}</span>
          </div>
          <Progress value={progress} />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Progress: {progress.toFixed(1)}%</p>
          <div onClick={stopPropagation}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this goal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your goal and all
                    associated data.
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
          </div>
        </CardFooter>
      </Card>
      <EditGoal
        goal={goal}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onGoalUpdated={onGoalUpdated}
      />
    </>
  );
};
