'use client';

import { Check, Flame, GlassWater, BookOpen, Sunrise, Footprints, Pencil, Sparkles } from 'lucide-react';
import type { Habit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: { [key: string]: React.ElementType } = {
  'glass-water': GlassWater,
  'book-open': BookOpen,
  'sunrise': Sunrise,
  'footprints': Footprints,
  'pencil': Pencil,
  'sparkles': Sparkles
};

const SketchyCheckbox = ({ checked }: { checked: boolean }) => (
  <div
    className={cn(
      'w-8 h-8 flex-shrink-0 rounded-md sketch-border interactive-sketch-border flex items-center justify-center cursor-pointer transition-colors',
      checked ? 'bg-primary/80 border-primary-foreground/50' : 'bg-background hover:bg-muted'
    )}
  >
    {checked && <Check className="w-6 h-6 text-primary-foreground" />}
  </div>
);

export default function HabitItem({ habit, onToggle }: { habit: Habit; onToggle: (id: number) => void; }) {
  const Icon = iconMap[habit.icon] || Sparkles;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg transition-all',
        habit.completed ? 'bg-primary/20' : 'bg-card'
      )}
    >
      <button onClick={() => onToggle(habit.id)} aria-label={`Toggle habit: ${habit.name}`}>
        <SketchyCheckbox checked={habit.completed} />
      </button>

      <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div className="flex-grow">
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
    </motion.div>
  );
}
