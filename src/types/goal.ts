import { z } from 'zod';

export const goalInputSchema = z
  .object({
    goalName: z.string().min(1, 'Goal name is required.'),
    description: z.string().optional(),
    targetAmount: z
      .any()
      // 入力値を安全に数値に変換（空ならNaN）
      .transform((val) => (String(val ?? '').trim() === '' ? NaN : Number(val)))
      // NaNでないかチェック（必須項目の代わり）
      .refine((val) => !isNaN(val), { message: 'Target amount is required.' })
      // 正の数かチェック
      .refine((val) => val > 0, { message: 'Target amount must be a positive number.' }),

    initialAmount: z
      .any()
      // 入力値を安全に数値に変換（空なら0）
      .transform((val) => (String(val ?? '').trim() === '' ? 0 : Number(val)))
      // 数値であり、0以上かチェック
      .refine((val) => !isNaN(val) && val >= 0, { message: 'Initial amount cannot be negative.' }),

    monthlyAmount: z
      .any()
      // 入力値を安全に数値に変換（空ならundefined）
      .transform((val) => (String(val ?? '').trim() === '' ? undefined : Number(val)))
      // undefined、または正の数かチェック
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: 'Monthly saving must be a positive number.',
      })
      .optional(),

    targetMonths: z
      .any()
      // 入力値を安全に数値に変換（空ならundefined）
      .transform((val) => (String(val ?? '').trim() === '' ? undefined : Number(val)))
      // undefined、または正の数かチェック
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: 'Target months must be a positive number.',
      })
      .optional(),
  })
  .refine((data) => data.monthlyAmount || data.targetMonths, {
    message: 'Either monthly saving or target months must be filled in.',
    path: ['monthlyAmount'],
  });
