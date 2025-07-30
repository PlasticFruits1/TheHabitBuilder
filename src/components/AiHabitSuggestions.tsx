'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, PlusCircle } from 'lucide-react';
import { suggestHabits } from '@/ai/flows/suggest-habits';
import type { Habit } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

const suggestionSchema = z.object({
  goals: z.string().min(10, { message: 'Please describe your goals in a bit more detail.' }),
});

interface AiHabitSuggestionsProps {
  habits: Habit[];
  onAddHabit: (habitName: string) => void;
}

export default function AiHabitSuggestions({ habits, onAddHabit }: AiHabitSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      goals: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof suggestionSchema>) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const existingHabits = habits.map((h) => h.name).join(', ');
      const result = await suggestHabits({
        existingHabits: existingHabits || 'None',
        goals: values.goals,
      });
      const newSuggestions = result.suggestions.split(',').map((s) => s.trim()).filter(Boolean);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching habit suggestions:', error);
       toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Couldn't get AI suggestions. Please try again later.",
      })
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAndRemoveSuggestion = (suggestion: string) => {
    onAddHabit(suggestion);
    setSuggestions(currentSuggestions => currentSuggestions.filter(s => s !== suggestion));
  }

  return (
    <Card className="sketch-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <Wand2 className="w-8 h-8 text-primary" />
          AI Habit Helper
        </CardTitle>
        <CardDescription className="font-body">
          Tell me your goals, and I'll suggest some simple habits for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body font-bold">My Goals</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'I want to be more active and learn a new skill'"
                      className="sketch-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="font-body font-bold text-base sketch-border interactive-sketch-border">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Suggest Habits'
              )}
            </Button>
          </form>
        </Form>
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3"
            >
              <h3 className="font-headline text-2xl">Here are some ideas:</h3>
              <ul className="space-y-2">
                <AnimatePresence>
                  {suggestions.map((suggestion) => (
                    <motion.li
                      key={suggestion}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between gap-2 p-3 bg-primary/10 rounded-md"
                    >
                      <span className="font-body">{suggestion}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddAndRemoveSuggestion(suggestion)}
                        className="interactive-sketch-border sketch-border"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
