import type { UserProgress, PPLRCycle, WorkoutType, ActiveWorkoutType, Exercise, CustomExercises } from './types';

const STORAGE_KEYS = {
  USER_PROGRESS: 'djinn_gym_progress',
  PPLR_CYCLE: 'djinn_pplr_cycle',
  CUSTOM_EXERCISES: 'djinn_custom_exercises',
};

export const DEFAULT_PROGRESS: UserProgress = {
  totalWorkouts: 0,
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  currentRank: 'Initiate',
  progressionPoints: 0,
  workoutHistory: [],
};

export const DEFAULT_PPLR: PPLRCycle = {
  cycle: 1,
  dayInCycle: 0,
  nextWorkoutType: 'push',
  lastResetDate: new Date().toISOString().split('T')[0],
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress');
  }
}

export function getPPLRCycle(): PPLRCycle {
  if (typeof window === 'undefined') return DEFAULT_PPLR;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PPLR_CYCLE);
    return stored ? JSON.parse(stored) : DEFAULT_PPLR;
  } catch {
    return DEFAULT_PPLR;
  }
}

export function savePPLRCycle(cycle: PPLRCycle): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.PPLR_CYCLE, JSON.stringify(cycle));
  } catch {
    console.error('Failed to save PPLR cycle');
  }
}

export function advancePPLRCycle(): PPLRCycle {
  const cycle = getPPLRCycle();
  const nextDay = (cycle.dayInCycle + 1) % 4;
  
  const workoutTypeMap: Record<number, WorkoutType> = {
    0: 'push',
    1: 'pull',
    2: 'legs',
    3: 'rest',
  };
  
  const updated = {
    ...cycle,
    dayInCycle: nextDay,
    nextWorkoutType: workoutTypeMap[nextDay],
  };
  
  // Reset cycle if we completed a full cycle
  if (nextDay === 0 && cycle.dayInCycle === 3) {
    updated.cycle = cycle.cycle + 1;
  }
  
  savePPLRCycle(updated);
  return updated;
}

export function exportData() {
  const progress = getProgress();
  const pplr = getPPLRCycle();
  return {
    progress,
    pplr,
    exportedAt: new Date().toISOString(),
  };
}

export function importData(data: any): boolean {
  try {
    if (data.progress) saveProgress(data.progress);
    if (data.pplr) savePPLRCycle(data.pplr);
    return true;
  } catch {
    return false;
  }
}

export function getCustomExercises(): CustomExercises {
  if (typeof window === 'undefined') return { push: [], pull: [], legs: [] };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXERCISES);
    return stored ? JSON.parse(stored) : { push: [], pull: [], legs: [] };
  } catch {
    return { push: [], pull: [], legs: [] };
  }
}

export function saveCustomExercises(exercises: CustomExercises): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, JSON.stringify(exercises));
  } catch {
    console.error('Failed to save custom exercises');
  }
}

export function addExercise(workoutType: ActiveWorkoutType, exercise: Exercise): void {
  const custom = getCustomExercises();
  custom[workoutType].push(exercise);
  saveCustomExercises(custom);
}

export function updateExercise(workoutType: ActiveWorkoutType, exerciseId: string, updates: Partial<Exercise>): void {
  const custom = getCustomExercises();
  const index = custom[workoutType].findIndex(e => e.id === exerciseId);
  if (index !== -1) {
    custom[workoutType][index] = { ...custom[workoutType][index], ...updates };
    saveCustomExercises(custom);
  }
}

export function deleteExercise(workoutType: ActiveWorkoutType, exerciseId: string): void {
  const custom = getCustomExercises();
  custom[workoutType] = custom[workoutType].filter(e => e.id !== exerciseId);
  saveCustomExercises(custom);
}
