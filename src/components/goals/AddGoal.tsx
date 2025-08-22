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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { addGoal, NewGoalData } from '@/lib/firebase/firestore';

const formSchema = z.object({
  goalName: z.string().min(1, 'Goal name is required.'),
  description: z.string().optional(),
  targetAmount: z.coerce.number().positive('Target amount must be a positive number.'),
  initialAmount: z.coerce.number().min(0, 'Initial amount cannot be negative.').optional(),
  monthlyAmount: z.coerce.number().positive('Monthly saving must be a positive number.'),
});

export const AddGoal = ({ onGoalAdded }: { onGoalAdded: () => void }) => {
  const { state } = useAuth();
  const { user } = state;
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: '',
      description: '',
      targetAmount: undefined,
      initialAmount: 0,
      monthlyAmount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      alert('You must be logged in to add a goal.');
      return;
    }

    const { targetAmount, initialAmount = 0, monthlyAmount } = values;
    
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
      initialAmount,
      sortOrder: 0, // Default sort order
      targetType: 'duration', // Default type
      targetDate,
    };

    try {
      await addGoal(user.uid, goalData);
      form.reset();
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
            What are you saving for? Let's set up a new goal.
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
            <FormField
              control={form.control}
              name="monthlyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Saving (¥)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
