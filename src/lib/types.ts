import type { LucideIcon } from 'lucide-react';

export interface Habit {
  id: number;
  name: string;
  icon: string;
  points: number;
  streak: number;
  completed: boolean;
}
