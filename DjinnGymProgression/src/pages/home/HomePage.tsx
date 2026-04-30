'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkoutData } from '../../lib/hooks';
import { RankBadge } from '../../components/rank-badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function Home() {
  const { progress, pplr, isLoaded } = useWorkoutData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded || !progress || !pplr) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (progress.progressionPoints / 400) * 100;
  const workoutTypeEmoji: Record<string, string> = {
    push: '💪',
    pull: '🎯',
    legs: '🦵',
    rest: '😴',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-accent">⚔️</div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Djinn Gym</h1>
              <p className="text-xs text-muted-foreground">Progression Tracker</p>
            </div>
          </div>
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              ⚙️
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Rank Section */}
        <Card className="mb-8 bg-card border-accent/30">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-2">CURRENT RANK</p>
                <h2 className="text-4xl font-bold text-foreground mb-4">{progress.currentRank}</h2>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-accent font-bold">{progress.progressionPoints}</span> / 400 points
                  </p>
                  <div className="w-full max-w-xs bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-accent/60 h-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <RankBadge rank={progress.currentRank} size="lg" showLabel={false} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{progress.totalWorkouts}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{progress.currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{progress.longestStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Points Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{progress.totalPoints}</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Workout */}
        <Card className="mb-8 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Next Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-6xl">{workoutTypeEmoji[pplr.nextWorkoutType]}</div>
              <div className="flex-1 ml-6">
                <p className="text-sm text-muted-foreground mb-2">
                  PPLR Cycle {pplr.cycle} • Day {pplr.dayInCycle + 1}/4
                </p>
                <p className="text-2xl font-bold text-foreground capitalize">
                  {pplr.nextWorkoutType === 'rest' ? 'Rest Day' : `${pplr.nextWorkoutType} Day`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {pplr.nextWorkoutType !== 'rest' ? (
            <Link to="/workout" className="col-span-2">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-lg">
                Start Workout
              </Button>
            </Link>
          ) : (
            <Button disabled className="col-span-2 py-6 text-lg opacity-50">
              Rest Day - Recovery Mode Active
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
