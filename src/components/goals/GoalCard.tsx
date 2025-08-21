import { Goal } from '@/types/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function GoalCard({ goal }: { goal: Goal }) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
        <CardDescription>
          {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
            goal.currentAmount,
          )}{' '}
          /
          {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
            goal.targetAmount,
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">{progress.toFixed(1)}%</p>
      </CardContent>
    </Card>
  );
}
