export type WorkoutType = 'push' | 'pull' | 'legs' | 'rest';
export type ActiveWorkoutType = Exclude<WorkoutType, 'rest'>;

export type ExerciseName = 
  | 'Bench Press' | 'Incline Dumbbell Press' | 'Cable Flyes'
  | 'Barbell Rows' | 'Lat Pulldowns' | 'Face Pulls'
  | 'Squats' | 'Leg Press' | 'Leg Curls'
  | 'Deadlifts' | 'Overhead Press' | 'Weighted Dips';

export interface Exercise {
  id: string;
  name: ExerciseName;
  sets: number;
  reps: number;
  workoutType: WorkoutType;
}

export type RankTier = 'Initiate' | 'Novice' | 'Adept' | 'Expert' | 'Master' | 'Grandmaster' | 'Sage' | 'Legend';

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  'Initiate': 0,
  'Novice': 50,
  'Adept': 100,
  'Expert': 150,
  'Master': 220,
  'Grandmaster': 300,
  'Sage': 365,
  'Legend': 400,
};

export const RANK_COLORS: Record<RankTier, string> = {
  'Initiate': 'bg-gray-500',
  'Novice': 'bg-blue-500',
  'Adept': 'bg-cyan-500',
  'Expert': 'bg-green-500',
  'Master': 'bg-yellow-500',
  'Grandmaster': 'bg-orange-500',
  'Sage': 'bg-purple-500',
  'Legend': 'bg-red-500',
};

export interface WorkoutSession {
  id: string;
  date: string;
  type: WorkoutType;
  exercises: Array<Exercise & { completed: boolean }>;
  duration: number; // in seconds
  completedAt?: string;
}

export interface UserProgress {
  totalWorkouts: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  currentRank: RankTier;
  progressionPoints: number;
  lastWorkoutDate?: string;
  workoutHistory: WorkoutSession[];
}

export interface PPLRCycle {
  cycle: number;
  dayInCycle: number; // 0: Push, 1: Pull, 2: Legs, 3: Rest
  nextWorkoutType: WorkoutType;
  lastResetDate: string;
}

export interface CustomExercises {
  push: Exercise[];
  pull: Exercise[];
  legs: Exercise[];
}
