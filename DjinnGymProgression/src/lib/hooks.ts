'use client';

import { useState, useEffect } from 'react';
import type { UserProgress, PPLRCycle, RankTier } from './types';
import  { RANK_THRESHOLDS } from './types';
import { getProgress, saveProgress, getPPLRCycle, savePPLRCycle, advancePPLRCycle } from './storage';

export function useWorkoutData() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [pplr, setPPLR] = useState<PPLRCycle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedProgress = getProgress();
    const loadedPPLR = getPPLRCycle();
    setProgress(loadedProgress);
    setPPLR(loadedPPLR);
    setIsLoaded(true);
  }, []);

  const updateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveProgress(updated);
  };

  const updatePPLR = (updated: PPLRCycle) => {
    setPPLR(updated);
    savePPLRCycle(updated);
  };

  const completeWorkout = (exerciseCount: number) => {
    if (!progress || !pplr) return;

    const pointsEarned = Math.min(exerciseCount * 10, 50); // 10 points per exercise, max 50
    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.lastWorkoutDate;

    // Calculate streak
    let newStreak = progress.currentStreak;
    if (lastDate !== today) {
      const lastDateObj = lastDate ? new Date(lastDate) : new Date();
      const todayObj = new Date();
      const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
      newStreak = diffDays === 1 ? progress.currentStreak + 1 : 1;
    }

    const newTotalPoints = progress.progressionPoints + pointsEarned;
    
    // Determine new rank
    let newRank: RankTier = progress.currentRank;
    for (const [rank, threshold] of Object.entries(RANK_THRESHOLDS)) {
      if (newTotalPoints >= threshold) {
        newRank = rank as RankTier;
      } else {
        break;
      }
    }

    const updated = {
      ...progress,
      totalWorkouts: progress.totalWorkouts + 1,
      totalPoints: progress.totalPoints + pointsEarned,
      progressionPoints: newTotalPoints,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      currentRank: newRank,
      lastWorkoutDate: today,
    };

    updateProgress(updated);
    
    // Advance PPLR cycle
    const nextCycle = advancePPLRCycle();
    setPPLR(nextCycle);
  };

  const resetData = () => {
    const defaultProgress: UserProgress = {
      totalWorkouts: 0,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      currentRank: 'Initiate',
      progressionPoints: 0,
      workoutHistory: [],
    };
    updateProgress(defaultProgress);
  };

  return {
    progress,
    pplr,
    isLoaded,
    updateProgress,
    updatePPLR,
    completeWorkout,
    resetData,
  };
}

export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return {
    seconds,
    isActive,
    toggleTimer,
    resetTimer,
  };
}
