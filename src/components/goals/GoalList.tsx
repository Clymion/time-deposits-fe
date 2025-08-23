'use client';

import { Goal } from '@/types/firestore';
import { GoalCard } from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  loading: boolean;
  onGoalUpdated: () => void;
}

export const GoalList = ({ goals, loading, onGoalUpdated }: GoalListProps) => {
  if (loading) {
    return <p className="text-center">Loading goals...</p>;
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">No savings goals yet.</h3>
        <p className="text-muted-foreground">
          Click the &ldquo;Add New Goal&rdquo; button to create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onGoalUpdated={onGoalUpdated} />
      ))}
    </div>
  );
};
