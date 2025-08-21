import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  depositDay: number;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Timestamp;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  monthlyAmount: number;
  initialAmount: number;
  currentAmount: number;
  targetDate?: Timestamp;
  targetType: 'date' | 'duration';
  sortOrder: number;
  isCompleted: boolean;
  isDeleted: boolean;
  stats: {
    totalDeposited: number;
    transactionCount: number;
    lastDepositDate?: Timestamp;
    progress: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'auto' | 'manual' | 'bonus';
  description?: string;
  executedAt: Timestamp;
  isDeleted: boolean;
}
