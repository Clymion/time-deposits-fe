# 設計
- Next.js
  - PWAを見据えて
- ドキュメント指向データベースなので、入れ子のデータ構造を定義
  - 論理削除

## データモデル
```ts
// users/{uid}
{
  uid: string
  depositDay: number
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
  createdAt: timestamp
}

// users/{uid}/goals/{goalId}  ← サブコレクション
{
  id: string
  name: string
  description?: string
  targetAmount: number
  monthlyAmount: number
  initialAmount: number
  currentAmount: number  // 非正規化
  targetDate?: date
  targetType: 'date' | 'duration'
  sortOrder: number
  isCompleted: boolean
  isDeleted: boolean
  
  // 集約データ（非正規化）
  stats: {
    totalDeposited: number
    transactionCount: number
    lastDepositDate?: timestamp
    progress: number  // 0-100
  }
  
  createdAt: timestamp
  updatedAt: timestamp
}

// users/{uid}/goals/{goalId}/transactions/{txId}  ← サブサブコレクション
{
  id: string
  amount: number
  type: 'auto' | 'manual' | 'bonus'
  description?: string
  executedAt: timestamp
  isDeleted: boolean
}
```

## 構成
- Frontend: Next.js Static Export → Cloud Storage
- Backend: Cloud Functions（スケジュール実行のみ）
- Database: Firestore（直接クライアントアクセス）
- Auth: Firebase Auth

## 技術スタック
- Frontend
  - Next.js Static Export
- 状態管理
  - React Context + useReducer
- UI Library
  - Tailwind + shadcn/ui
- Backend
  - Client + Cloud Functions

