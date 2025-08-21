import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
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
