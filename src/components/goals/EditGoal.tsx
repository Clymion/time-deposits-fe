'use client';

import { useState } from 'react';
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
  DialogTrigger,
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

const formSchema = z.object({
  name: z.string().min(1, 'Goal name is required.'),
  description: z.string().optional(),
  targetAmount: z.coerce.number().positive('Target amount must be a positive number.'),
  monthlyAmount: z.coerce.number().positive('Monthly saving must be a positive number.'),
});

interface EditGoalProps {
  goal: Goal;
  onGoalUpdated: () => void;
  children: React.ReactNode; // To use as a trigger
}

export const EditGoal = ({ goal, onGoalUpdated, children }: EditGoalProps) => {
  const { state } = useAuth();
  const { user } = state;
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount,
      monthlyAmount: goal.monthlyAmount,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const { targetAmount, monthlyAmount } = values;

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
      targetDate,
    };

    try {
      await updateGoal(user.uid, goal.id, goalData);
      form.reset(values); // Reset form with new values
      setOpen(false);
      onGoalUpdated();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              name="name"
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
            <FormField
              control={form.control}
              name="monthlyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Saving (¥)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
