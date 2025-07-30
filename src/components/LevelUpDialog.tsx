'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PartyPopper } from 'lucide-react';

interface LevelUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  quote: string;
}

export default function LevelUpDialog({ isOpen, onClose, level, quote }: LevelUpDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sketch-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-4xl flex items-center gap-4">
            <PartyPopper className="w-10 h-10 text-primary animate-bounce" />
            Level Up!
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg text-foreground pt-4">
            Congratulations! You've reached Level {level}!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 font-body text-center text-lg italic border-y-2 border-dashed border-border my-4">
          "{quote}"
        </div>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="font-body font-bold text-base sketch-border interactive-sketch-border"
          >
            Keep Going!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
