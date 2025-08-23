'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthGuard } from "@/components/auth/AuthGuard";
import { GoalList } from "@/components/goals/GoalList";
import { AddGoal } from "@/components/goals/AddGoal";
import { useAuth } from '@/contexts/AuthContext';
import { getGoals } from '@/lib/firebase/firestore';
import { Goal } from '@/types/firestore';

export default function Home() {
  const { state } = useAuth();
  const { user } = state;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const userGoals = await getGoals(user.uid);
        setGoals(userGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
        // TODO: Set an error state to show in the UI
      } finally {
        setLoading(false);
      }
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <AuthGuard>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Your Goals</h2>
          <AddGoal onGoalAdded={fetchGoals} />
        </div>
        <GoalList goals={goals} loading={loading} onGoalUpdated={fetchGoals} />
      </div>
    </AuthGuard>
  );
}
