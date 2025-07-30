'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatePresence, motion } from 'framer-motion';
import type { Habit } from '@/lib/types';
import { useEffect } from 'react';

const editHabitSchema = z.object({
  name: z.string().min(3, { message: 'Habit name must be at least 3 characters.' }),
  trackProgress: z.boolean().default(false),
  trackFrequency: z.boolean().default(false),
  target: z.coerce.number().min(1).optional(),
  unit: z.string().optional(),
  frequency: z.coerce.number().min(1).optional(),
}).refine(data => {
    if (data.trackProgress && (data.target === undefined || !data.unit)) {
        return false;
    }
    return true;
}, {
    message: "Target and unit are required for progress-based habits.",
    path: ['target'],
}).refine(data => {
    if (data.trackFrequency && data.frequency === undefined) {
        return false;
    }
    return true;
}, {
    message: "Frequency is required for frequency-based habits.",
    path: ['frequency'],
});


export type EditHabitFormData = z.infer<typeof editHabitSchema>;

interface EditHabitDialogProps {
  habit: Habit;
  onEditHabit: (data: Habit) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditHabitDialog({ habit, onEditHabit, isOpen, onClose }: EditHabitDialogProps) {

  const form = useForm<EditHabitFormData>({
    resolver: zodResolver(editHabitSchema),
    defaultValues: {
      name: habit.name || '',
      trackProgress: habit.target !== undefined,
      trackFrequency: habit.frequency !== undefined,
      target: habit.target,
      unit: habit.unit || '',
      frequency: habit.frequency
    },
  });
  
  useEffect(() => {
    form.reset({
        name: habit.name || '',
        trackProgress: habit.target !== undefined,
        trackFrequency: habit.frequency !== undefined,
        target: habit.target,
        unit: habit.unit || '',
        frequency: habit.frequency
    })
  }, [habit, form])

  const onSubmit = (values: EditHabitFormData) => {
    const updatedHabit: Habit = {
        ...habit,
        name: values.name,
        target: values.trackProgress ? values.target : undefined,
        currentProgress: values.trackProgress ? habit.currentProgress || 0 : undefined,
        unit: values.trackProgress ? values.unit : (values.trackFrequency ? 'times' : undefined),
        frequency: values.trackFrequency ? values.frequency : undefined,
        timesCompleted: values.trackFrequency ? habit.timesCompleted || 0 : undefined,
    }
    // Clear out other tracking properties when switching type
    if (!values.trackProgress) {
        updatedHabit.target = undefined;
        updatedHabit.currentProgress = undefined;
        if (!values.trackFrequency) {
            updatedHabit.unit = undefined;
        }
    }
    if (!values.trackFrequency) {
        updatedHabit.timesCompleted = undefined;
    }


    onEditHabit(updatedHabit);
  };
  
  const trackProgress = form.watch('trackProgress');
  const trackFrequency = form.watch('trackFrequency');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sketch-border">
            <DialogHeader>
                <DialogTitle className="font-headline text-3xl">Edit Habit</DialogTitle>
                <DialogDescription className="font-body">
                    Make changes to your habit below.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Habit Name</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., 'Practice guitar'"
                        className="sketch-border text-base"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <div className="space-y-3">
                    <FormLabel>How do you want to track it?</FormLabel>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <FormField
                        control={form.control}
                        name="trackProgress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 sketch-border flex-1">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Track Progress</FormLabel>
                            </div>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="trackFrequency"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 sketch-border flex-1">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Track Frequency</FormLabel>
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                </div>


                <AnimatePresence>
                {trackProgress && (
                    <motion.div 
                        key="progress-tracker-edit"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 items-end"
                    >
                        <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormLabel>Target</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 8" className="sketch-border" {...field} value={field.value ?? ''}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 'glasses' or 'km'" className="sketch-border" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </motion.div>
                )}

                {trackFrequency && (
                    <motion.div
                        key="frequency-tracker-edit"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>How many times per day?</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 3" className="sketch-border" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </motion.div>
                )}
                </AnimatePresence>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="font-body font-bold text-base sketch-border interactive-sketch-border">
                    Save Changes
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
