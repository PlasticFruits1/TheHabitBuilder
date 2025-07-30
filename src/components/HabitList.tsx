import type { Habit } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HabitItem from '@/components/HabitItem';
import { ListTodo, Eye } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: number) => void;
  isPreview: boolean;
}

export default function HabitList({ habits, onToggleHabit, isPreview }: HabitListProps) {
  return (
    <Card className="sketch-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <ListTodo className="w-8 h-8 text-primary" />
          Today's Habits
        </CardTitle>
         {isPreview && (
          <CardDescription className="flex items-center gap-2 font-body text-base">
            <Eye className="w-5 h-5" />
            This is a preview. Add a habit or interact with one to start your own list!
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {habits.length === 0 && !isPreview ? (
           <div className="text-center text-muted-foreground font-body py-8">
            <p className="text-xl mb-2">Your habit list is empty.</p>
            <p>Add a new habit below to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
