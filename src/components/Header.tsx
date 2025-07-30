import { Sparkles, Star } from 'lucide-react';

interface HeaderProps {
  points: number;
  level: number;
}

export default function Header({ points, level }: HeaderProps) {
  return (
    <header className="flex flex-wrap justify-between items-center p-4 sm:p-6 bg-card/50 border-b-2 border-foreground/10">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl text-foreground drop-shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
          The Habit Builder
        </h1>
        <p className="font-body text-muted-foreground mt-1">Build better habits, one day at a time.</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        <div className="flex items-center gap-2 font-body text-lg bg-secondary/30 text-secondary-foreground rounded-full px-4 py-2 sketch-border border-secondary-foreground/30">
          <Star className="w-6 h-6 text-yellow-500 animate-grow" />
          <span className="font-bold">Level {level}</span>
        </div>
        <div className="flex items-center gap-2 font-body text-lg bg-accent/30 text-accent-foreground rounded-full px-4 py-2 sketch-border border-accent-foreground/30">
          <Sparkles className="w-6 h-6 text-accent-foreground/80 animate-sparkle" />
          <span className="font-bold">{points}</span>
          <span>Points</span>
        </div>
      </div>
    </header>
  );
}
