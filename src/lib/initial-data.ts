import type { Habit, GardenItem } from './types';

export const initialHabits: Habit[] = [
  { id: 1, name: 'Drink 8 glasses of water', icon: 'glass-water', points: 10, streak: 5, completed: false },
  { id: 2, name: 'Read for 20 minutes', icon: 'book-open', points: 15, streak: 12, completed: true },
  { id: 3, name: 'Morning meditation', icon: 'sunrise', points: 20, streak: 2, completed: false },
  { id: 4, name: 'Go for a walk', icon: 'footprints', points: 10, streak: 8, completed: true },
  { id: 5, name: 'Write in journal', icon: 'pencil', points: 5, streak: 20, completed: false },
];

export const initialGardenItems: GardenItem[] = [
  {
    id: 1,
    name: 'Pastel Flower',
    cost: 20,
    unlocked: true,
    position: { top: '60%', left: '20%' },
    size: { width: '80px', height: '80px' },
    dataAiHint: 'hand drawn flower',
  },
  {
    id: 2,
    name: 'Small Sprout',
    cost: 10,
    unlocked: true,
    position: { top: '75%', left: '45%' },
    size: { width: '60px', height: '60px' },
    dataAiHint: 'hand drawn sprout',
  },
  {
    id: 3,
    name: 'Leafy Bush',
    cost: 50,
    unlocked: false,
    position: { top: '65%', left: '70%' },
    size: { width: '100px', height: '100px' },
    dataAiHint: 'hand drawn bush',
  },
   {
    id: 4,
    name: 'Cute Tree',
    cost: 150,
    unlocked: true,
    position: { top: '40%', left: '65%' },
    size: { width: '150px', height: '150px' },
    dataAiHint: 'hand drawn tree',
  },
];
