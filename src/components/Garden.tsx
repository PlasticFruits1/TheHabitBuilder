'use client';

import Image from 'next/image';
import type { GardenItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';

export default function Garden({ items }: { items: GardenItem[] }) {
  const unlockedItems = items.filter((item) => item.unlocked);

  return (
    <Card className="sketch-border w-full h-full min-h-[400px] lg:min-h-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-3xl">
          <Sprout className="w-8 h-8 text-primary" />
          My Garden
        </CardTitle>
      </CardHeader>
      <CardContent className="relative w-full h-[300px] lg:h-[calc(100%-100px)] bg-gradient-to-b from-primary/10 to-background rounded-lg overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-800/20 rounded-t-full -translate-x-1/4 scale-150" />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-green-800/30 rounded-t-full translate-x-1/4 scale-125" />
        
        {unlockedItems.map((item, index) => (
          <div
            key={item.id}
            className="absolute animate-grow"
            style={{ 
              top: item.position.top, 
              left: item.position.left, 
              width: item.size.width,
              height: item.size.height,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <Image
              src={`https://placehold.co/${item.size.width.replace('px', '')}x${item.size.height.replace('px', '')}.png`}
              alt={item.name}
              width={parseInt(item.size.width)}
              height={parseInt(item.size.height)}
              className="drop-shadow-lg"
              data-ai-hint={item.dataAiHint}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
