import type { Habit } from './types';

export const initialHabits: Habit[] = [
  { id: 1, name: 'Drink 8 glasses of water', icon: 'glass-water', points: 10, streak: 5, completed: false },
  { id: 2, name: 'Read for 20 minutes', icon: 'book-open', points: 15, streak: 12, completed: true },
  { id: 3, name: 'Morning meditation', icon: 'sunrise', points: 20, streak: 2, completed: false },
  { id: 4, name: 'Go for a walk', icon: 'footprints', points: 10, streak: 8, completed: true },
  { id: 5, name: 'Write in journal', icon: 'pencil', points: 5, streak: 20, completed: false },
];
