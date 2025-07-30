'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';

const addHabitSchema = z.object({
  habitName: z.string().min(3, { message: 'Habit name must be at least 3 characters.' }),
});

interface AddHabitFormProps {
  onAddHabit: (habitName: string) => void;
}

export default function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const form = useForm<z.infer<typeof addHabitSchema>>({
    resolver: zodResolver(addHabitSchema),
    defaultValues: {
      habitName: '',
    },
  });

  const onSubmit = (values: z.infer<typeof addHabitSchema>) => {
    onAddHabit(values.habitName);
    form.reset();
  };

  return (
    <Card className="sketch-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <Plus className="w-8 h-8 text-primary" />
          Add Your Own Habit
        </CardTitle>
        <CardDescription className="font-body">
          What new habit do you want to build?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="habitName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Habit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'Practice guitar for 15 minutes'"
                      className="sketch-border text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="font-body font-bold text-base sketch-border interactive-sketch-border">
              Add Habit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
