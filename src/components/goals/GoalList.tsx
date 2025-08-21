import { Goal } from '@/types/firestore';
import { GoalCard } from './GoalCard';

type GoalListProps = {
  goals: Goal[];
  loading: boolean;
};

export function GoalList({ goals, loading }: GoalListProps) {
  if (loading) {
    return <p>Loading goals...</p>;
  }

  if (goals.length === 0) {
    return <p>No goals yet. Add one to get started!</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
