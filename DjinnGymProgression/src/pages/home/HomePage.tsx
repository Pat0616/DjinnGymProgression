'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Target, Footprints, Moon, Settings, Sparkles } from 'lucide-react';
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
  const workoutTypeIcon: Record<string, React.ReactNode> = {
    push: <Target className="w-5 h-5" />,
    pull: <Sparkles className="w-5 h-5" />,
    legs: <Footprints className="w-5 h-5" />,
    rest: <Moon className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg">
              <Dumbbell className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight">
                Djinn Gym
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Progression Tracker</p>
            </div>
          </div>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-accent/10 transition-all duration-200">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Rank Section */}
        <Card className="mb-8 bg-gradient-to-br from-card via-card to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wide">Current Rank</p>
                <h2 className="text-5xl font-bold text-foreground mb-4 tracking-tight">{progress.currentRank}</h2>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-accent font-bold text-lg">{progress.progressionPoints}</span> / 400 points
                  </p>
                  <div className="w-full max-w-xs bg-muted/50 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-accent via-accent to-accent/80 h-full transition-all duration-700 ease-out rounded-full shadow-sm"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border/50 hover:border-accent/30 transition-colors duration-200 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{progress.totalWorkouts}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-accent/30 transition-colors duration-200 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{progress.currentStreak}</p>
              <p className="text-sm text-muted-foreground font-medium">days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-accent/30 transition-colors duration-200 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{progress.longestStreak}</p>
              <p className="text-sm text-muted-foreground font-medium">days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-accent/30 transition-colors duration-200 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Points Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{progress.totalPoints}</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Workout */}
        <Card className="mb-8 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-accent/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Next Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 border border-accent/20">
                {workoutTypeIcon[pplr.nextWorkoutType]}
              </div>
              <div className="flex-1 ml-6">
                <p className="text-sm text-muted-foreground mb-2 font-medium">
                  PPLR Cycle {pplr.cycle} • Day {pplr.dayInCycle + 1}/4
                </p>
                <p className="text-3xl font-bold text-foreground capitalize tracking-tight">
                  {pplr.nextWorkoutType === 'rest' ? 'Rest Day' : `${pplr.nextWorkoutType} Day`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-6">
          {pplr.nextWorkoutType !== 'rest' ? (
            <Link to="/workout" className="col-span-2">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-8 text-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                Start Workout
              </Button>
            </Link>
          ) : (
            <Button disabled className="col-span-2 py-8 text-xl opacity-60 shadow-sm">
              Rest Day - Recovery Mode Active
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
