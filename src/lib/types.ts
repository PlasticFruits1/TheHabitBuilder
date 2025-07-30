import type { LucideIcon } from 'lucide-react';

export interface Habit {
  id: number;
  name: string;
  icon: string;
  points: number;
  streak: number;
  completed: boolean;
}

export interface GardenItem {
  id: number;
  name: string;
  cost: number;
  unlocked: boolean;
  position: { top: string; left: string; };
  size: { width: string; height: string; };
  dataAiHint: string;
}
