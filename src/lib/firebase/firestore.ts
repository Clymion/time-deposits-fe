import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './client';
import { Goal } from '@/types/firestore';

export const getGoals = async (uid: string): Promise<Goal[]> => {
  const goalsRef = collection(db, 'users', uid, 'goals');
  const q = query(goalsRef, where('isDeleted', '==', false), orderBy('sortOrder', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Goal);
};

export const addGoal = async (
  uid: string,
  goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const goalsRef = collection(db, 'users', uid, 'goals');
  await addDoc(goalsRef, {
    ...goalData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

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