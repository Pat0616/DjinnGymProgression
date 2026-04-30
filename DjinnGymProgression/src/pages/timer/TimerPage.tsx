'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '../../lib/hooks';
import type { Exercise } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

export default function TimerPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutType, setWorkoutType] = useState<string>('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ACTIVE_TIME = 90; // 1:20 - work time per set
  const REST_TIME = 90; // 1:30 - rest time between sets
  const timerDuration = isResting ? REST_TIME : ACTIVE_TIME;
  const { seconds, isActive, toggleTimer, resetTimer } = useTimer(timerDuration);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('selectedExercises');
    const storedType = sessionStorage.getItem('workoutType');

    if (stored && storedType) {
      setExercises(JSON.parse(stored));
      setWorkoutType(storedType);
    } else {
      router.push('/');
    }
  }, [router]);

  // Handle timer cycles
  useEffect(() => {
    if (seconds === 0 && isActive) {
      if (!isResting) {
        // Finished active set
        if (currentSet < currentExercise.sets) {
          // Move to rest
          setIsResting(true);
          resetTimer();
        } else {
          // Exercise complete
          if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
            setIsResting(false);
            resetTimer();
          } else {
            // Workout complete
            completeWorkout();
          }
        }
      } else {
        // Finished resting
        setCurrentSet(currentSet + 1);
        setIsResting(false);
        resetTimer();
      }
    }
  }, [seconds, isActive]);

  const currentExercise = exercises[currentExerciseIndex];

  if (!mounted || exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const completeWorkout = () => {
    router.push(`/completion?exercises=${exercises.length}`);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentExerciseIndex + (currentSet / currentExercise.sets)) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Exercise Info */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </p>
            <h1 className="text-4xl font-bold text-foreground mb-2">{currentExercise.name}</h1>
            <p className="text-lg text-accent font-semibold">
              Set {currentSet} of {currentExercise.sets}
            </p>
          </div>

          {/* Status Badge */}
          <div className={`mb-8 p-6 rounded-lg border-2 text-center transition-all ${isResting
              ? 'border-yellow-500 bg-yellow-500/20 scale-105'
              : 'border-accent bg-accent/20'
            }`}>
            <p className={`text-2xl font-bold mb-2 uppercase tracking-wider ${isResting ? 'text-yellow-400' : 'text-accent'
              }`}>
              {isResting ? '🌀 REST TIME' : '💪 WORK TIME'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isResting
                ? `Rest between sets (${REST_TIME}s total)`
                : `Work for this set (${ACTIVE_TIME}s)`}
            </p>
          </div>

          {/* Large Timer */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-accent mb-4 font-mono">
              {formatTime(seconds)}
            </div>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: currentExercise.sets }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < currentSet ? 'bg-accent' : 'bg-muted'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex gap-4 justify-center mb-8">
            <Button
              onClick={toggleTimer}
              className={`flex-1 py-6 text-lg font-bold ${isActive
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-accent hover:bg-accent/90'
                }`}
            >
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="flex-1 py-6 text-lg font-bold"
            >
              Reset
            </Button>
          </div>

          {/* Exercise Details */}
          <Card className="bg-card border-border/50 mb-8">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reps per set:</span>
                  <span className="font-semibold text-foreground">{currentExercise.reps}</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total sets:</span>
                  <span className="font-semibold text-foreground">{currentExercise.sets}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Button */}
          <Button
            onClick={() => {
              if (confirm('Are you sure? This will end your workout.')) {
                router.push('/');
              }
            }}
            variant="outline"
            className="w-full"
          >
            Exit Workout
          </Button>
        </div>
      </main>

      {/* Bottom Exercise List */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Upcoming Exercises</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className={`text-xs p-2 rounded transition-colors ${idx === currentExerciseIndex
                    ? 'bg-accent/30 text-accent font-semibold'
                    : 'text-muted-foreground'
                  }`}
              >
                {idx + 1}. {ex.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
