'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWorkoutData } from '../../lib/hooks';
import { RankBadge } from '../../components/rank-badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Link from 'next/link';

export default function CompletionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress, isLoaded, completeWorkout } = useWorkoutData();
  const [completed, setCompleted] = useState(false);

  const exerciseCount = parseInt(searchParams.get('exercises') || '0');

  useEffect(() => {
    if (isLoaded && !completed) {
      completeWorkout(0, exerciseCount);
      setCompleted(true);
      // Clear session storage
      sessionStorage.removeItem('selectedExercises');
      sessionStorage.removeItem('workoutType');
    }
  }, [isLoaded, exerciseCount, completeWorkout, completed]);

  if (!isLoaded || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const pointsEarned = Math.min(exerciseCount * 10, 50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Celebration Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animation: `fall ${2 + Math.random() * 2}s linear`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <main className="container mx-auto px-4 py-8 max-w-md flex flex-col items-center justify-center min-h-screen">
        {/* Success Message */}
        <Card className="w-full bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 mb-8">
          <CardContent className="pt-12 pb-12 text-center">
            <h1 className="text-5xl font-bold text-accent mb-4">🎉</h1>
            <h2 className="text-3xl font-bold text-foreground mb-2">Workout Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Excellent work! You&apos;ve earned progression points.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="w-full bg-card border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Workout Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Exercises Completed</p>
                <p className="text-3xl font-bold text-accent">{exerciseCount}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Points Earned</p>
                <p className="text-3xl font-bold text-accent">+{pointsEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank Display */}
        <Card className="w-full bg-card border-border/50 mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4">
              <RankBadge rank={progress.currentRank} size="lg" showLabel={false} />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                <p className="text-2xl font-bold text-foreground">{progress.currentRank}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {progress.progressionPoints} / 400 points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Workouts</p>
              <p className="text-2xl font-bold text-accent">{progress.totalWorkouts}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-accent">{progress.currentStreak} 🔥</p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="w-full bg-muted border-border/50 mb-8">
          <CardContent className="pt-6 pb-6">
            <p className="text-center text-sm text-foreground italic">
              {progress.currentStreak > 7
                ? "You're on a winning streak! Keep it going! 💪"
                : progress.currentRank === 'Legend'
                ? "You've reached the pinnacle! You are a LEGEND! 👑"
                : `Keep pushing! You're making progress towards the next rank`}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">
              Return to Home
            </Button>
          </Link>
          <Link href="/settings" className="block">
            <Button variant="outline" className="w-full py-6">
              View Progress
            </Button>
          </Link>
        </div>
      </main>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
