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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AnimatePresence, motion } from 'framer-motion';
import type { Habit } from '@/lib/types';
import { useEffect } from 'react';

const editHabitSchema = z.object({
  name: z.string().min(3, { message: 'Habit name must be at least 3 characters.' }),
  trackingType: z.enum(['simple', 'progress', 'frequency']).default('simple'),
  target: z.coerce.number().min(1).optional(),
  unit: z.string().optional(),
  frequency: z.coerce.number().min(1).optional(),
}).refine(data => {
    if (data.trackingType === 'progress' && (data.target === undefined || !data.unit)) {
        return false;
    }
    return true;
}, {
    message: "Target and unit are required for progress-based habits.",
    path: ['target'],
}).refine(data => {
    if (data.trackingType === 'frequency' && data.frequency === undefined) {
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
    
  const getTrackingType = (h: Habit) => {
    if (h.target !== undefined) return 'progress';
    if (h.frequency !== undefined) return 'frequency';
    return 'simple';
  }

  const form = useForm<EditHabitFormData>({
    resolver: zodResolver(editHabitSchema),
    defaultValues: {
      name: habit.name || '',
      trackingType: getTrackingType(habit),
      target: habit.target || undefined,
      unit: habit.unit || '',
      frequency: habit.frequency || undefined
    },
  });
  
  useEffect(() => {
    form.reset({
        name: habit.name || '',
        trackingType: getTrackingType(habit),
        target: habit.target || undefined,
        unit: habit.unit || '',
        frequency: habit.frequency || undefined
    })
  }, [habit, form])

  const onSubmit = (values: EditHabitFormData) => {
    const updatedHabit: Habit = {
        ...habit,
        name: values.name,
        target: values.trackingType === 'progress' ? values.target : undefined,
        currentProgress: values.trackingType === 'progress' ? habit.currentProgress || 0 : undefined,
        unit: values.trackingType === 'progress' ? values.unit : (values.trackingType === 'frequency' ? 'times' : undefined),
        frequency: values.trackingType === 'frequency' ? values.frequency : undefined,
        timesCompleted: values.trackingType === 'frequency' ? habit.timesCompleted || 0 : undefined,
    }
    // Clear out other tracking properties when switching type
    if (updatedHabit.target === undefined) {
        updatedHabit.currentProgress = undefined;
    }
    if (updatedHabit.frequency === undefined) {
        updatedHabit.timesCompleted = undefined;
    }
    if (values.trackingType === 'simple') {
        updatedHabit.unit = undefined;
    }


    onEditHabit(updatedHabit);
  };
  
  const trackingType = form.watch('trackingType');

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
                
                <FormField
                control={form.control}
                name="trackingType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>How do you want to track it?</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="simple" />
                            </FormControl>
                            <FormLabel className="font-normal">Simple (Done / Not Done)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="progress" />
                            </FormControl>
                            <FormLabel className="font-normal">Track Progress (e.g., quantity)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="frequency" />
                            </FormControl>
                            <FormLabel className="font-normal">Track Frequency (e.g., times per day)</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <AnimatePresence>
                {trackingType === 'progress' && (
                    <motion.div 
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

                {trackingType === 'frequency' && (
                    <motion.div
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
