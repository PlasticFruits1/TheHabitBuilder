'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const addHabitSchema = z.object({
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

export type AddHabitFormData = z.infer<typeof addHabitSchema>;

interface AddHabitFormProps {
  onAddHabit: (data: AddHabitFormData) => void;
}

export default function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const form = useForm<AddHabitFormData>({
    resolver: zodResolver(addHabitSchema),
    defaultValues: {
      name: '',
      trackingType: 'simple',
    },
  });

  const onSubmit = (values: AddHabitFormData) => {
    onAddHabit(values);
    form.reset();
  };
  
  const trackingType = form.watch('trackingType');

  return (
    <Card className="sketch-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <Plus className="w-8 h-8 text-primary" />
          Add Your Own Habit
        </CardTitle>
        <CardDescription className="font-body">
          What new habit do you want to build? Choose how you'll track it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <Input type="number" placeholder="e.g., 8" className="sketch-border" {...field} />
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
                            <Input placeholder="e.g., 'glasses' or 'km'" className="sketch-border" {...field} />
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
                            <Input type="number" placeholder="e.g., 3" className="sketch-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </motion.div>
            )}
            </AnimatePresence>

            <Button type="submit" className="font-body font-bold text-base sketch-border interactive-sketch-border">
              Add Habit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
