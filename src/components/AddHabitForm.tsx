'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Sparkles, GlassWater, BookOpen, Sunrise, Footprints, Pencil, Dumbbell, Bike, BrainCircuit, Leaf, BedDouble, Apple } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';

const addHabitSchema = z.object({
  name: z.string().min(3, { message: 'Habit name must be at least 3 characters.' }),
  icon: z.string().default('sparkles'),
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

export type AddHabitFormData = z.infer<typeof addHabitSchema>;

const availableIcons = [
    { name: 'sparkles', component: Sparkles },
    { name: 'glass-water', component: GlassWater },
    { name: 'book-open', component: BookOpen },
    { name: 'sunrise', component: Sunrise },
    { name: 'footprints', component: Footprints },
    { name: 'pencil', component: Pencil },
    { name: 'dumbbell', component: Dumbbell },
    { name: 'bike', component: Bike },
    { name: 'brain-circuit', component: BrainCircuit },
    { name: 'leaf', component: Leaf },
    { name: 'bed-double', component: BedDouble },
    { name: 'apple', component: Apple },
];

interface AddHabitFormProps {
  onAddHabit: (data: AddHabitFormData) => void;
}

export default function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const form = useForm<AddHabitFormData>({
    resolver: zodResolver(addHabitSchema),
    defaultValues: {
      name: '',
      icon: 'sparkles',
      trackProgress: false,
      trackFrequency: false,
    },
  });

  const onSubmit = (values: AddHabitFormData) => {
    onAddHabit(values);
    form.reset();
  };
  
  const trackProgress = form.watch('trackProgress');
  const trackFrequency = form.watch('trackFrequency');

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
              name="icon"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose an Icon</FormLabel>
                   <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2"
                    >
                      {availableIcons.map((icon) => (
                        <FormItem key={icon.name} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={icon.name} className="sr-only" />
                          </FormControl>
                          <FormLabel className={cn(
                            "p-2 rounded-md cursor-pointer sketch-border interactive-sketch-border transition-colors",
                            field.value === icon.name ? 'bg-primary/80 text-primary-foreground' : 'bg-background hover:bg-muted'
                          )}>
                            <icon.component className="w-6 h-6" />
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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
                        <FormLabel>Track Progress (e.g., quantity)</FormLabel>
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
                        <FormLabel>Track Frequency (e.g., times per day)</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
               <p className="text-sm text-muted-foreground">Select one, both, or neither for a simple "Done/Not Done" habit.</p>
            </div>


            <AnimatePresence>
            {trackProgress && (
                <motion.div 
                    key="progress-tracker-add"
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

            {trackFrequency && (
                 <motion.div
                    key="frequency-tracker-add"
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
