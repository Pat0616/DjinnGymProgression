import type { Exercise, WorkoutType } from './types';

export const EXERCISE_DATABASE: Record<WorkoutType, Exercise[]> = {
  push: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      sets: 4,
      reps: 6,
      workoutType: 'push',
    },
    {
      id: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      sets: 3,
      reps: 8,
      workoutType: 'push',
    },
    {
      id: 'cable-flyes',
      name: 'Cable Flyes',
      sets: 3,
      reps: 10,
      workoutType: 'push',
    },
  ],
  pull: [
    {
      id: 'barbell-rows',
      name: 'Barbell Rows',
      sets: 4,
      reps: 6,
      workoutType: 'pull',
    },
    {
      id: 'lat-pulldowns',
      name: 'Lat Pulldowns',
      sets: 3,
      reps: 8,
      workoutType: 'pull',
    },
    {
      id: 'face-pulls',
      name: 'Face Pulls',
      sets: 3,
      reps: 12,
      workoutType: 'pull',
    },
  ],
  legs: [
    {
      id: 'squats',
      name: 'Squats',
      sets: 4,
      reps: 6,
      workoutType: 'legs',
    },
    {
      id: 'leg-press',
      name: 'Leg Press',
      sets: 3,
      reps: 8,
      workoutType: 'legs',
    },
    {
      id: 'leg-curls',
      name: 'Leg Curls',
      sets: 3,
      reps: 10,
      workoutType: 'legs',
    },
  ],
  rest: [],
};

export function getExercisesForWorkout(workoutType: WorkoutType): Exercise[] {
  return EXERCISE_DATABASE[workoutType] || [];
}
