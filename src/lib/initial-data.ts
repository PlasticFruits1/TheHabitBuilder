import type { Habit } from './types';

export const initialHabits: Habit[] = [
  { 
    id: 1, 
    name: 'Drink water', 
    icon: 'glass-water', 
    points: 10, 
    streak: 5, 
    completed: false,
    target: 8,
    currentProgress: 2,
    unit: 'glasses'
  },
  { 
    id: 2, 
    name: 'Read', 
    icon: 'book-open', 
    points: 15, 
    streak: 12, 
    completed: true,
    target: 20,
    currentProgress: 20,
    unit: 'minutes'
  },
  { 
    id: 3, 
    name: 'Morning meditation', 
    icon: 'sunrise', 
    points: 20, 
    streak: 2, 
    completed: false,
    frequency: 1,
    timesCompleted: 0,
    unit: 'times'
  },
  { 
    id: 4, 
    name: 'Go for a walk', 
    icon: 'footprints', 
    points: 10, 
    streak: 8, 
    completed: true,
    target: 2,
    currentProgress: 2,
    unit: 'km'
  },
  { 
    id: 5, 
    name: 'Write in journal', 
    icon: 'pencil', 
    points: 5, 
    streak: 20, 
    completed: false,
    frequency: 1,
    timesCompleted: 0,
    unit: 'times'
  },
];
