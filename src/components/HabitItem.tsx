'use client';

import { Check, Flame, GlassWater, BookOpen, Sunrise, Footprints, Pencil, Sparkles, Plus, Minus, Repeat } from 'lucide-react';
import type { Habit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const iconMap: { [key: string]: React.ElementType } = {
  'glass-water': GlassWater,
  'book-open': BookOpen,
  'sunrise': Sunrise,
  'footprints': Footprints,
  'pencil': Pencil,
  'sparkles': Sparkles
};

const SimpleCheckbox = ({ checked, onToggle }: { checked: boolean, onToggle: () => void }) => (
  <button
    onClick={onToggle}
    aria-label="Toggle habit completion"
    className={cn(
      'w-8 h-8 flex-shrink-0 rounded-md sketch-border interactive-sketch-border flex items-center justify-center cursor-pointer transition-colors',
      checked ? 'bg-primary/80 border-primary-foreground/50' : 'bg-background hover:bg-muted'
    )}
  >
    {checked && <Check className="w-6 h-6 text-primary-foreground" />}
  </button>
);

const ProgressTracker = ({ habit, onUpdate }: { habit: Habit, onUpdate: (id: number, progress: 'inc') => void }) => (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">{habit.currentProgress} / {habit.target} {habit.unit}</span>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 sketch-border interactive-sketch-border" onClick={() => onUpdate(habit.id, 'inc')}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
        <Progress value={((habit.currentProgress || 0) / (habit.target || 1)) * 100} className="h-3 sketch-border bg-primary/20" />
    </div>
)

const FrequencyTracker = ({ habit, onUpdate }: { habit: Habit, onUpdate: (id: number, progress: 'inc') => void }) => (
    <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="h-8 w-8 p-0 sketch-border interactive-sketch-border" onClick={() => onUpdate(habit.id, 'inc')}>
            <Plus className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-lg font-semibold">
            <Repeat className="w-5 h-5 text-primary" />
            <span>{habit.timesCompleted} / {habit.frequency}</span>
        </div>
        <span className="text-muted-foreground">{habit.unit}</span>
    </div>
)


export default function HabitItem({ habit, onUpdateProgress, onSimpleToggle }: { habit: Habit; onUpdateProgress: (id: number, progress: 'inc') => void; onSimpleToggle: (id: number) => void; }) {
  const Icon = iconMap[habit.icon] || Sparkles;

  const isProgressHabit = habit.target !== undefined;
  const isFrequencyHabit = habit.frequency !== undefined;
  const isSimpleHabit = !isProgressHabit && !isFrequencyHabit;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg transition-all',
        habit.completed ? 'bg-primary/20' : 'bg-card'
      )}
    >
      <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full mt-1">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div className="flex-grow space-y-2">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-body font-semibold text-lg">{habit.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{habit.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>{habit.points} points</span>
                  </div>
                </div>
            </div>
             {isSimpleHabit && <SimpleCheckbox checked={habit.completed} onToggle={() => onSimpleToggle(habit.id)} />}
        </div>

        {isProgressHabit && <ProgressTracker habit={habit} onUpdate={onUpdateProgress} />}
        {isFrequencyHabit && <FrequencyTracker habit={habit} onUpdate={onUpdateProgress} />}
        
      </div>
    </motion.div>
  );
}
