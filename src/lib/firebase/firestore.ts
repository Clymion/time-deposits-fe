import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from './client';
import { Goal } from '@/types/firestore';

// origin/develop の簡潔な実装を採用
export const getGoals = async (uid: string): Promise<Goal[]> => {
  const goalsRef = collection(db, 'users', uid, 'goals');
  const q = query(goalsRef, where('isDeleted', '==', false), orderBy('sortOrder', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Goal);
};

// HEAD の具体的な実装を採用
// Type for the data needed to create a new goal
export type NewGoalData = Pick<Goal,
  'name' | 'description' | 'targetAmount' | 'monthlyAmount' | 'initialAmount' | 'targetType' | 'targetDate' | 'sortOrder'
>;

export const addGoal = async (userId: string, goalData: NewGoalData) => {
  if (!userId) throw new Error("User ID is required to add a goal.");

  const goalsRef = collection(db, 'users', userId, 'goals');

  const newGoal: Omit<Goal, 'id'> = {
    ...goalData,
    currentAmount: goalData.initialAmount || 0,
    isCompleted: false,
    isDeleted: false,
    stats: {
      totalDeposited: goalData.initialAmount || 0,
      transactionCount: goalData.initialAmount > 0 ? 1 : 0,
      progress: goalData.targetAmount > 0 ? ((goalData.initialAmount || 0) / goalData.targetAmount) * 100 : 0,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(goalsRef, newGoal);
  return docRef.id;
};

// origin/develop の実装を採用
export type UpdateGoalData = Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'stats'>>;

export const updateGoal = async (userId: string, goalId: string, goalData: UpdateGoalData) => {
  if (!userId || !goalId) throw new Error("User ID and Goal ID are required.");

  const goalRef = doc(db, 'users', userId, 'goals', goalId);

  const updatedData = {
    ...goalData,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(goalRef, updatedData);
};

export const deleteGoal = async (userId: string, goalId: string) => {
  if (!userId || !goalId) throw new Error("User ID and Goal ID are required.");

  const goalRef = doc(db, 'users', userId, 'goals', goalId);

  await updateDoc(goalRef, {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
};
