'use client';

import { useState, useMemo } from 'react';
import type { Habit } from '@/lib/types';
import { initialHabits } from '@/lib/initial-data';
import Header from '@/components/Header';
import HabitList from '@/components/HabitList';
import AiHabitSuggestions from '@/components/AiHabitSuggestions';
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  
  const totalPoints = useMemo(() => {
    return habits.reduce((sum, habit) => habit.completed ? sum + habit.points : sum, 0);
  }, [habits]);

  const handleToggleHabit = (id: number) => {
    let toggledHabit: Habit | undefined;
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          toggledHabit = { ...habit, completed: !habit.completed };
          return toggledHabit;
        }
        return habit;
      })
    );
    if (toggledHabit) {
      toast({
        title: toggledHabit.completed ? "Habit Completed!" : "Habit Undone",
        description: toggledHabit.completed ? `You earned ${toggledHabit.points} points!` : `You lost ${toggledHabit.points} points.`,
      });
    }
  };

  const handleAddHabit = (habitName: string) => {
    const newHabit: Habit = {
      id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
      name: habitName,
      icon: 'sparkles',
      points: 10,
      streak: 0,
      completed: false,
    };
    setHabits([...habits, newHabit]);
    toast({
      title: "New Habit Added!",
      description: `"${habitName}" is now in your daily list.`
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header points={totalPoints} />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <HabitList habits={habits} onToggleHabit={handleToggleHabit} />
          <AiHabitSuggestions habits={habits} onAddHabit={handleAddHabit} />
        </div>
      </main>
    </div>
  );
}
