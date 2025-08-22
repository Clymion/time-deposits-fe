'use client';

import { Goal } from '@/types/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EditGoal } from './EditGoal';

interface GoalCardProps {
  goal: Goal;
  onGoalUpdated: () => void;
}

export const GoalCard = ({ goal, onGoalUpdated }: GoalCardProps) => {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <EditGoal goal={goal} onGoalUpdated={onGoalUpdated}>
      <Card className="w-full cursor-pointer transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>{goal.name}</CardTitle>
          {goal.description && <CardDescription>{goal.description}</CardDescription>}
        </CardHeader>
        <CardContent>
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">Progress: {progress.toFixed(1)}%</p>
        </CardFooter>
      </Card>
    </EditGoal>
  );
};
