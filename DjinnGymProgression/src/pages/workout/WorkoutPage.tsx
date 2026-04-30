'use client';

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Sparkles, Footprints } from 'lucide-react';
import { useWorkoutData } from '../../lib/hooks';
import { getExercisesForWorkout } from '../../lib/exercise';
import type { Exercise, ActiveWorkoutType } from '../../lib/types';
import { getCustomExercises } from '../../lib/storage';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const { pplr, isLoaded } = useWorkoutData();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && pplr && pplr.nextWorkoutType === 'rest') {
      navigate('/');
    }
  }, [isLoaded, pplr, navigate]);

  if (!mounted || !isLoaded || !pplr) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Use custom exercises if available, otherwise use default library
  const customExercises = getCustomExercises();
  const workoutType = pplr.nextWorkoutType as ActiveWorkoutType;
  const hasCustomExercises = customExercises[workoutType]?.length > 0;
  const availableExercises = hasCustomExercises 
    ? customExercises[workoutType]
    : getExercisesForWorkout(workoutType);

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
    
    navigate('/timer');
  };

  const workoutTypeIcon: Record<string, React.ReactNode> = {
    push: <Target className="w-6 h-6" />,
    pull: <Sparkles className="w-6 h-6" />,
    legs: <Footprints className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/">
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
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 border border-accent/20">
                {workoutTypeIcon[pplr.nextWorkoutType]}
              </div>
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
