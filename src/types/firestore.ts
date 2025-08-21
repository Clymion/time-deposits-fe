import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  depositDay: number; // 1-31 or special values for end of month
  settings: {
    theme: 'light' | 'dark' | 'system';
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
  // `duration` is not a good name, maybe `period` or `term` is better.
  // But I will follow the design.md for now.
  targetType: 'date' | 'duration';
  sortOrder: number;
  isCompleted: boolean;
  isDeleted: boolean;
  stats: {
    totalDeposited: number;
    transactionCount: number;
    lastDepositDate?: Timestamp;
    progress: number; // 0-100
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
