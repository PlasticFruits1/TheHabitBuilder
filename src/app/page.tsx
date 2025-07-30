'use client';

import { useState, useEffect } from 'react';
import type { Habit } from '@/lib/types';
import Header from '@/components/Header';
import HabitList from '@/components/HabitList';
import AiHabitSuggestions from '@/components/AiHabitSuggestions';
import AddHabitForm, { type AddHabitFormData } from '@/components/AddHabitForm';
import LevelUpDialog from '@/components/LevelUpDialog';
import { useToast } from "@/hooks/use-toast"
import { getMotivationalQuote } from '@/ai/flows/get-motivational-quote';
import useSound from 'use-sound';
import EditHabitDialog from '@/components/EditHabitDialog';

const POINTS_PER_LEVEL = 50;

export default function Home() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [level, setLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLevelUpDialogOpen, setIsLevelUpDialogOpen] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHabits = localStorage.getItem('habits');
      const savedLevel = localStorage.getItem('level');
      const savedPoints = localStorage.getItem('totalPoints');

      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
      if (savedLevel) {
        setLevel(JSON.parse(savedLevel));
      }
      if (savedPoints) {
        setTotalPoints(JSON.parse(savedPoints));
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('level', JSON.stringify(level));
      localStorage.setItem('totalPoints', JSON.stringify(totalPoints));
    }
  }, [habits, level, totalPoints, isClient]);


  const [playHabitComplete] = useSound('/sounds/complete.mp3', { volume: 0.7, disabled: !isClient });
  const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: 0.8, disabled: !isClient });

  const calculatePoints = (habitList: Habit[]) => {
     return habitList.reduce((sum, habit) => {
      if (habit.completed) {
        return sum + habit.points;
      }
      // Combine point calculation for potentially mixed habits
      let habitPoints = 0;
      if (habit.target && habit.currentProgress) {
        const progress = Math.min(habit.currentProgress, habit.target);
        habitPoints += Math.floor((progress / habit.target) * habit.points);
      }
      if (habit.frequency && habit.timesCompleted) {
         habitPoints += (habit.timesCompleted * habit.points);
      }
      // For simple habits, no partial points. Only completed gives points.
      return sum + habitPoints;
    }, 0);
  }

  useEffect(() => {
    if (isClient) {
        const calculatedPoints = calculatePoints(habits);
        setTotalPoints(calculatedPoints);

        const newLevel = Math.floor(calculatedPoints / POINTS_PER_LEVEL) + 1;
        if (newLevel > level) {
        setLevel(newLevel);
        handleLevelUp();
        }
    }
  }, [habits, level, isClient]);
  
  const handleLevelUp = async () => {
    if (playLevelUp) playLevelUp();
    try {
      const { quote } = await getMotivationalQuote();
      setMotivationalQuote(quote);
    } catch (error) {
      console.error("Error fetching motivational quote:", error);
      setMotivationalQuote("Keep up the great work! You're making amazing progress.");
    }
    setIsLevelUpDialogOpen(true);
  };

  const handleUpdateHabitProgress = (id: number, progress: number | 'inc') => {
    let updatedHabit: Habit | undefined;
    const newHabits = habits.map((habit) => {
      if (habit.id === id) {
        let newProgress = habit.currentProgress ?? 0;
        let newTimesCompleted = habit.timesCompleted ?? 0;
        
        updatedHabit = {...habit};

        if (habit.target !== undefined) { // Progress-based habit
          newProgress = progress === 'inc' ? newProgress + 1 : progress as number;
          updatedHabit.currentProgress = Math.min(newProgress, habit.target);
        }
        
        if (habit.frequency !== undefined) { // Frequency-based habit
          newTimesCompleted = progress === 'inc' ? newTimesCompleted + 1 : progress as number;
          updatedHabit.timesCompleted = Math.min(newTimesCompleted, habit.frequency);
        }
        
        if (updatedHabit) {
            const isProgressComplete = !updatedHabit.target || (updatedHabit.currentProgress && updatedHabit.currentProgress >= updatedHabit.target);
            const isFrequencyComplete = !updatedHabit.frequency || (updatedHabit.timesCompleted && updatedHabit.timesCompleted >= updatedHabit.frequency);
            const isNowComplete = isProgressComplete && isFrequencyComplete;

            if (isNowComplete && !habit.completed) {
                updatedHabit.completed = true;
                if(playHabitComplete) playHabitComplete();
                toast({
                    title: "Habit Completed!",
                    description: `You earned ${updatedHabit.points} points for completing "${updatedHabit.name}"!`,
                });
            } else if (!isNowComplete && habit.completed) {
                updatedHabit.completed = false;
            }
             return updatedHabit;
        }
      }
      return habit;
    });

    setHabits(newHabits);
  };

  const handleAddHabit = (data: AddHabitFormData) => {
    const newHabit: Habit = {
      id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
      name: data.name,
      icon: 'sparkles',
      points: 10,
      streak: 0,
      completed: false,
      target: data.trackProgress ? data.target : undefined,
      currentProgress: data.trackProgress ? 0 : undefined,
      unit: data.trackProgress ? data.unit : (data.trackFrequency ? 'times' : undefined),
      frequency: data.trackFrequency ? data.frequency : undefined,
      timesCompleted: data.trackFrequency ? 0 : undefined,
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast({
      title: "New Habit Added!",
      description: `"${data.name}" is now in your daily list.`
    })
  };
  
  const handleSimpleToggle = (id: number) => {
    const newHabits = habits.map(habit => {
      if (habit.id === id) {
        const isNowComplete = !habit.completed;
        if(isNowComplete) {
            if(playHabitComplete) playHabitComplete();
            toast({
                title: "Habit Completed!",
                description: `You earned ${habit.points} points!`
            })
        }
        return {...habit, completed: isNowComplete};
      }
      return habit;
    })
    setHabits(newHabits);
  }

  const handleAddSimpleHabit = (name: string) => {
    handleAddHabit({ name, trackProgress: false, trackFrequency: false });
  }

  const handleDeleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    toast({
      title: "Habit Removed",
      description: "The habit has been deleted from your list.",
      variant: 'destructive'
    })
  }

  const handleEditHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    toast({
      title: "Habit Updated!",
      description: `"${updatedHabit.name}" has been successfully updated.`
    })
    setEditingHabit(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header points={totalPoints} level={level} />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <HabitList 
            habits={habits} 
            onUpdateProgress={handleUpdateHabitProgress} 
            isPreview={false}
            onSimpleToggle={handleSimpleToggle}
            onDelete={handleDeleteHabit}
            onEdit={(habit) => setEditingHabit(habit)}
          />
          <AddHabitForm onAddHabit={handleAddHabit} />
          <AiHabitSuggestions habits={habits} onAddHabit={handleAddSimpleHabit} />
        </div>
      </main>
      <LevelUpDialog
        isOpen={isLevelUpDialogOpen}
        onClose={() => setIsLevelUpDialogOpen(false)}
        level={level}
        quote={motivationalQuote}
      />
      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          onEditHabit={handleEditHabit}
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  );
}
