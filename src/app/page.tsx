'use client';

import { useState, useEffect } from 'react';
import type { Habit } from '@/lib/types';
import { initialHabits } from '@/lib/initial-data';
import Header from '@/components/Header';
import HabitList from '@/components/HabitList';
import AiHabitSuggestions from '@/components/AiHabitSuggestions';
import AddHabitForm from '@/components/AddHabitForm';
import LevelUpDialog from '@/components/LevelUpDialog';
import { useToast } from "@/hooks/use-toast"
import { getMotivationalQuote } from '@/ai/flows/get-motivational-quote';
import useSound from 'use-sound';

const POINTS_PER_LEVEL = 50;

export default function Home() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [isPreview, setIsPreview] = useState(true);
  const [level, setLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLevelUpDialogOpen, setIsLevelUpDialogOpen] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  const [playHabitComplete] = useSound('/sounds/complete.mp3', { volume: 0.7 });
  const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: 0.8 });


  useEffect(() => {
    const calculatedPoints = habits.reduce((sum, habit) => habit.completed ? sum + habit.points : sum, 0);
    setTotalPoints(calculatedPoints);

    const newLevel = Math.floor(calculatedPoints / POINTS_PER_LEVEL) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      handleLevelUp();
    }
  }, [habits, level]);
  
  const handleLevelUp = async () => {
    playLevelUp();
    try {
      const { quote } = await getMotivationalQuote();
      setMotivationalQuote(quote);
    } catch (error) {
      console.error("Error fetching motivational quote:", error);
      setMotivationalQuote("Keep up the great work! You're making amazing progress.");
    }
    setIsLevelUpDialogOpen(true);
  };

  const handleToggleHabit = (id: number) => {
    if (isPreview) {
      setHabits([]);
      setIsPreview(false);
    }
    let toggledHabit: Habit | undefined;
    const newHabits = habits.map((habit) => {
      if (habit.id === id) {
        toggledHabit = { ...habit, completed: !habit.completed };
        return toggledHabit;
      }
      return habit;
    });

    setHabits(newHabits);

    if (toggledHabit) {
      if (toggledHabit.completed) {
        playHabitComplete();
      }
      toast({
        title: toggledHabit.completed ? "Habit Completed!" : "Habit Undone",
        description: toggledHabit.completed ? `You earned ${toggledHabit.points} points!` : `You lost ${toggledHabit.points} points.`,
      });
    }
  };

  const handleAddHabit = (habitName: string) => {
    if (isPreview) {
      setHabits([]);
      setIsPreview(false);
    }
    const newHabit: Habit = {
      id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
      name: habitName,
      icon: 'sparkles',
      points: 10,
      streak: 0,
      completed: false,
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast({
      title: "New Habit Added!",
      description: `"${habitName}" is now in your daily list.`
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header points={totalPoints} level={level} />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <HabitList habits={habits} onToggleHabit={handleToggleHabit} isPreview={isPreview} />
          <AddHabitForm onAddHabit={handleAddHabit} />
          <AiHabitSuggestions habits={habits} onAddHabit={handleAddHabit} />
        </div>
      </main>
      <LevelUpDialog
        isOpen={isLevelUpDialogOpen}
        onClose={() => setIsLevelUpDialogOpen(false)}
        level={level}
        quote={motivationalQuote}
      />
    </div>
  );
}
