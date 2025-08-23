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
import { addGoal, NewGoalData } from '@/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { goalInputSchema } from '@/types/goal';


export const AddGoal = ({ onGoalAdded }: { onGoalAdded: () => void }) => {
  const { state } = useAuth();
  const { user } = state;
  const [open, setOpen] = useState(false);
  const [lastFocused, setLastFocused] = useState<'monthly' | 'months' | null>(null);

  const form = useForm<z.infer<typeof goalInputSchema>>({
    resolver: zodResolver(goalInputSchema),
    defaultValues: {
      goalName: '',
      description: '',
      targetAmount: undefined,
      initialAmount: 0,
      monthlyAmount: undefined,
      targetMonths: undefined,
    },
  });

  const { watch, setValue } = form;
  const targetAmount = watch('targetAmount');
  const initialAmount = watch('initialAmount');
  const monthlyAmount = watch('monthlyAmount');
  const targetMonths = watch('targetMonths');

  useEffect(() => {
    const parsedTargetAmount = parseFloat(String(targetAmount ?? ''));
    const parsedInitialAmount = parseFloat(String(initialAmount ?? '0')) || 0;
    const parsedMonthlyAmount = parseFloat(String(monthlyAmount ?? ''));
    const parsedTargetMonths = parseFloat(String(targetMonths ?? ''));

    if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) return;

    const remainingAmount = parsedTargetAmount - parsedInitialAmount;
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
  }, [targetAmount, initialAmount, monthlyAmount, targetMonths, lastFocused, setValue]);


  const onSubmit = async (values: z.infer<typeof goalInputSchema>) => {
    if (!user) {
      alert('You must be logged in to add a goal.');
      return;
    }

    const { targetAmount, initialAmount = 0, monthlyAmount } = values;
    
    if (!monthlyAmount || monthlyAmount <= 0) {
      alert("Monthly saving amount is invalid.");
      return;
    }

    // Calculate targetDate
    let targetDate: Date | null = null;
    if (targetAmount && monthlyAmount > 0) {
      const remainingAmount = targetAmount - initialAmount;
      if (remainingAmount > 0) {
        const monthsNeeded = Math.ceil(remainingAmount / monthlyAmount);
        const now = new Date();
        targetDate = new Date(now.setMonth(now.getMonth() + monthsNeeded));
      } else {
        targetDate = new Date(); // Already achieved
      }
    }

    if (!targetDate) {
      // This case should ideally be handled by form validation
      // but as a safeguard:
      console.error("Could not calculate a target date.");
      alert("Please ensure target amount and monthly savings are set correctly.");
      return;
    }

    const goalData: NewGoalData = {
      ...values,
      monthlyAmount,
      initialAmount,
      sortOrder: 0, // Default sort order
      targetType: 'duration', // Default type
      targetDate: Timestamp.fromDate(targetDate),
    };

    try {
      await addGoal(user.uid, goalData);
      form.reset({
        goalName: '',
        description: '',
        targetAmount: undefined,
        initialAmount: 0,
        monthlyAmount: undefined,
        targetMonths: undefined,
      });
      setOpen(false);
      onGoalAdded(); // Callback to refresh the list
    } catch (error) {
      console.error('Error adding goal:', error);
      // TODO: Show user-friendly error message
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create a New Savings Goal</DialogTitle>
          <DialogDescription>
            What are you saving for? Let&apos;s set up a new goal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="goalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Laptop, Vacation Fund" {...field} />
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
                    <Input placeholder="A short description of your goal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (¥)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Amount (¥)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        placeholder="10000" 
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
                        placeholder="15" 
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
