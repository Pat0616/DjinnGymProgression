'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkoutData } from '../../lib/hooks';
import { RankBadge } from '../../components/rank-badge';
import { ExerciseEditor } from '../../components/exercise-editor';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { RANK_THRESHOLDS,  } from '../../lib/types';
import type {WorkoutType} from '../../lib/types';
import { exportData, importData, getCustomExercises, saveCustomExercises } from '../../lib/storage';

export default function SettingsPage() {
  const { progress, isLoaded, resetData } = useWorkoutData();
  const [mounted, setMounted] = useState(false);
  const [customExercises, setCustomExercises] = useState<any>({ push: [], pull: [], legs: [] });
  const [editingWorkout, setEditingWorkout] = useState<WorkoutType | null>(null);

  useEffect(() => {
    setMounted(true);
    const exercises = getCustomExercises();
    setCustomExercises(exercises);
  }, []);

  if (!mounted || !isLoaded || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleExport = () => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `djinn-gym-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          if (importData(data)) {
            alert('Data imported successfully! Please refresh the page.');
            window.location.reload();
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you absolutely sure? This will reset all your progress permanently.')) {
      resetData();
      alert('All data has been reset.');
    }
  };

  const handleSaveExercises = (workoutType: WorkoutType, exercises: any) => {
    const updated = { ...customExercises, [workoutType]: exercises };
    setCustomExercises(updated);
    saveCustomExercises(updated);
    setEditingWorkout(null);
    alert('Exercises saved successfully!');
  };

  const ranksArray = Object.entries(RANK_THRESHOLDS).map(([rank, threshold]) => ({
    rank,
    threshold,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Settings & Progress</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Current Status */}
        <Card className="mb-8 bg-card border-accent/30">
          <CardHeader>
            <CardTitle>Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Rank</p>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{progress.currentRank}</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Progression</span>
                      <span className="text-sm text-accent">{progress.progressionPoints}/400</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-accent to-accent/60 h-full"
                        style={{ width: `${Math.min((progress.progressionPoints / 400) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <RankBadge rank={progress.currentRank} size="lg" showLabel={false} />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{progress.totalWorkouts}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{progress.totalPoints}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{progress.currentStreak}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{progress.longestStreak}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Last Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-accent">
                {progress.lastWorkoutDate
                  ? new Date(progress.lastWorkoutDate).toLocaleDateString()
                  : 'Never'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rank Progression Guide */}
        <Card className="mb-8 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Rank Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranksArray.map(({ rank, threshold }) => {
                const isCurrentOrPast = progress.progressionPoints >= threshold;
                const isCurrent = progress.currentRank === rank;

                return (
                  <div
                    key={rank}
                    className={`p-3 rounded-lg border transition-colors ${
                      isCurrent
                        ? 'bg-accent/20 border-accent/50'
                        : isCurrentOrPast
                        ? 'bg-muted/50 border-border/30'
                        : 'bg-muted/20 border-border/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RankBadge rank={rank as any} size="sm" showLabel={false} />
                        <div>
                          <p className={`font-semibold ${isCurrent ? 'text-accent' : ''}`}>
                            {rank}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {threshold} points {isCurrentOrPast && '✓'}
                          </p>
                        </div>
                      </div>
                      {isCurrent && <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Current</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Customization */}
        <Card className="mb-8 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Customize Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Customize exercises, sets, and reps for each workout type. Each exercise will run on a 1:20 work / 1:30 rest timer.
            </p>
            <div className="space-y-4">
              {(['push', 'pull', 'legs'] as WorkoutType[]).map((workoutType) => (
                <div key={workoutType} className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground capitalize">
                      {workoutType === 'push' ? 'Push Day' : workoutType === 'pull' ? 'Pull Day' : 'Legs Day'}
                    </h3>
                    <Button
                      onClick={() => setEditingWorkout(editingWorkout === workoutType ? null : workoutType)}
                      className="bg-accent hover:bg-accent/90 text-background"
                      size="sm"
                    >
                      {editingWorkout === workoutType ? 'Close' : 'Edit'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {customExercises[workoutType]?.length || 0} exercises
                  </p>
                  {editingWorkout === workoutType && (
                    <ExerciseEditor
                      workoutType={workoutType}
                      exercises={customExercises[workoutType] || []}
                      onSave={(exercises) => handleSaveExercises(workoutType, exercises)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-8 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start"
            >
              📥 Export Data
            </Button>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full justify-start"
            >
              📤 Import Data
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              🔄 Reset All Progress
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-muted border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Djinn Gym Tracker v1.0
              <br />
              Track your fitness journey with RPG-style progression
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
