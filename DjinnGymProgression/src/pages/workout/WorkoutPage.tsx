'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutData } from '../../lib/hooks';
import { getExercisesForWorkout } from '../../lib/exercise';
import type { Exercise } from '../../lib/types';
import { getCustomExercises } from '../../lib/storage';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Link from 'next/link';

export default function WorkoutPage() {
  const router = useRouter();
  const { progress, pplr, isLoaded, completeWorkout } = useWorkoutData();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && pplr && pplr.nextWorkoutType === 'rest') {
      router.push('/');
    }
  }, [isLoaded, pplr, router]);

  if (!mounted || !isLoaded || !pplr) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Use custom exercises if available, otherwise use default library
  const customExercises = getCustomExercises();
  const hasCustomExercises = customExercises[pplr.nextWorkoutType]?.length > 0;
  const availableExercises = hasCustomExercises 
    ? customExercises[pplr.nextWorkoutType]
    : getExercisesForWorkout(pplr.nextWorkoutType);

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.some((e) => e.id === exercise.id);
      if (exists) {
        return prev.filter((e) => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) return;
    
    // Store selected exercises in session
    sessionStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
    sessionStorage.setItem('workoutType', pplr.nextWorkoutType);
    
    router.push('/timer');
  };

  const workoutTypeEmoji: Record<string, string> = {
    push: '💪',
    pull: '🎯',
    legs: '🦵',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Select Exercises</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Workout Type Header */}
        <Card className="mb-8 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{workoutTypeEmoji[pplr.nextWorkoutType]}</span>
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Workout</p>
                <h2 className="text-3xl font-bold capitalize">{pplr.nextWorkoutType} Day</h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Select at least one exercise to begin. You can select up to {availableExercises.length} exercises.
            </p>
          </CardContent>
        </Card>

        {/* Exercise Selection */}
        <div className="space-y-3 mb-8">
          {availableExercises.map((exercise) => {
            const isSelected = selectedExercises.some((e) => e.id === exercise.id);
            return (
              <Card
                key={exercise.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-accent/20 border-accent/50'
                    : 'bg-card border-border/50 hover:border-border'
                }`}
                onClick={() => toggleExercise(exercise)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-accent border-accent'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && <span className="text-accent-foreground font-bold">✓</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selection Summary */}
        <Card className="mb-8 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Selected Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedExercises.length === 0 ? (
              <p className="text-muted-foreground text-sm">No exercises selected yet</p>
            ) : (
              <ul className="space-y-2">
                {selectedExercises.map((exercise) => (
                  <li key={exercise.id} className="text-sm text-foreground flex justify-between">
                    <span>{exercise.name}</span>
                    <span className="text-muted-foreground">{exercise.sets}×{exercise.reps}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              Total: {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleStartWorkout}
          disabled={selectedExercises.length === 0}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-lg disabled:opacity-50"
        >
          {selectedExercises.length === 0
            ? 'Select exercises to continue'
            : `Start Workout (${selectedExercises.length} exercises)`}
        </Button>
      </main>
    </div>
  );
}
