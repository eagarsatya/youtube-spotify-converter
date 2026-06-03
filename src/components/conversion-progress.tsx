'use client';

import { Progress } from '@/components/ui/progress';
import { ConversionProgress as ProgressType } from '@/types';

interface ConversionProgressProps {
  progress: ProgressType;
}

export function ConversionProgress({ progress }: ConversionProgressProps) {
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-6 bg-card border rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Finding matches on Spotify...</h3>
        <span className="text-muted-foreground font-medium">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-3" />
      
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>{progress.completed} of {progress.total} tracks processed</span>
        {progress.currentTrack && (
          <span className="truncate max-w-[200px] sm:max-w-[300px]">
            Searching: {progress.currentTrack}
          </span>
        )}
      </div>
    </div>
  );
}
