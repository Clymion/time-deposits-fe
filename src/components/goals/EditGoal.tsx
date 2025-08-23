'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { updateGoal, UpdateGoalData } from '@/lib/firebase/firestore';
import { Goal } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';
import { goalInputSchema } from '@/types/goal';

interface EditGoalProps {
  goal: Goal;
  onGoalUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditGoal = ({ goal, onGoalUpdated, open, onOpenChange }: EditGoalProps) => {
  const { state } = useAuth();
  const { user } = state;
  const [lastFocused, setLastFocused] = useState<'monthly' | 'months' | null>(null);

  const calculateInitialMonths = () => {
    if (goal.targetAmount > goal.currentAmount && goal.monthlyAmount > 0) {
      return Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyAmount);
    }
    return undefined;
  };

  const form = useForm<z.infer<typeof goalInputSchema>>({
    resolver: zodResolver(goalInputSchema),
    defaultValues: {
      goalName: goal.goalName,
      description: goal.description || '',
      targetAmount: goal.targetAmount,
      monthlyAmount: goal.monthlyAmount,
      targetMonths: calculateInitialMonths(),
    },
  });

  const { watch, setValue } = form;
  const targetAmount = watch('targetAmount');
  const monthlyAmount = watch('monthlyAmount');
  const targetMonths = watch('targetMonths');

  useEffect(() => {
    const parsedTargetAmount = parseFloat(String(targetAmount ?? ''));
    const parsedMonthlyAmount = parseFloat(String(monthlyAmount ?? ''));
    const parsedTargetMonths = parseFloat(String(targetMonths ?? ''));

    if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) return;

    const remainingAmount = parsedTargetAmount - goal.currentAmount;
    if (remainingAmount <= 0) return;

    if (lastFocused === 'months' && !isNaN(parsedTargetMonths) && parsedTargetMonths > 0) {
      const newMonthlyAmount = Math.ceil(remainingAmount / parsedTargetMonths);
      if (newMonthlyAmount !== parsedMonthlyAmount) {
        setValue('monthlyAmount', newMonthlyAmount, { shouldValidate: true });
      }
    } else if (lastFocused === 'monthly' && !isNaN(parsedMonthlyAmount) && parsedMonthlyAmount > 0) {
      const newTargetMonths = Math.ceil(remainingAmount / parsedMonthlyAmount);
      if (newTargetMonths !== parsedTargetMonths) {
        setValue('targetMonths', newTargetMonths, { shouldValidate: true });
      }
    }
  }, [targetAmount, monthlyAmount, targetMonths, goal.currentAmount, lastFocused, setValue]);


  const onSubmit = async (values: z.infer<typeof goalInputSchema>) => {
    if (!user) return;

    const { targetAmount, monthlyAmount } = values;

    if (!monthlyAmount || monthlyAmount <= 0) {
      alert("Monthly saving amount is invalid.");
      return;
    }

    // Recalculate targetDate based on new values
    let targetDate: Date | null = null;
    if (targetAmount && monthlyAmount > 0) {
      const remainingAmount = targetAmount - goal.currentAmount;
      if (remainingAmount > 0) {
        const monthsNeeded = Math.ceil(remainingAmount / monthlyAmount);
        const now = new Date();
        targetDate = new Date(now.setMonth(now.getMonth() + monthsNeeded));
      } else {
        targetDate = new Date(); // Already achieved
      }
    }

    if (!targetDate) {
      alert("Could not calculate a target date.");
      return;
    }

    const goalData: UpdateGoalData = {
      ...values,
      monthlyAmount,
      targetDate: targetDate ? Timestamp.fromDate(targetDate) : undefined,
    };

    try {
      await updateGoal(user.uid, goal.id, goalData);
      form.reset(values); // Reset form with new values
      onOpenChange(false); // Close dialog
      onGoalUpdated();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
          <DialogDescription>
            Update the details of your goal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields are same as AddGoal, pre-filled with goal data */}
            <FormField
              control={form.control}
              name="goalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (¥)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Saving (¥)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onFocus={() => setLastFocused('monthly')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Months</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onFocus={() => setLastFocused('months')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
