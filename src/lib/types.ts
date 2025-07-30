export interface Habit {
  id: number;
  name: string;
  icon: string;
  points: number;
  streak: number;
  completed: boolean;
  
  // Detailed tracking fields can now be combined
  target?: number; // e.g., 8 for glasses of water, 5 for km
  currentProgress?: number; // e.g., 3 glasses drunk, 2 km run
  unit?: string; // e.g., 'glasses', 'km', 'times'
  
  frequency?: number; // How many times a day to do it
  timesCompleted?: number; // How many times it has been done today
}
