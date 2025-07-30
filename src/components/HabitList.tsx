import type { Habit } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HabitItem from '@/components/HabitItem';
import { ListTodo } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: number) => void;
}

export default function HabitList({ habits, onToggleHabit }: HabitListProps) {
  return (
    <Card className="sketch-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <ListTodo className="w-8 h-8 text-primary" />
          Today's Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
