'use client';

import { useState } from 'react';
import type { Exercise, WorkoutType } from '../lib/types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Trash2, Plus, Edit2 } from 'lucide-react';

interface ExerciseEditorProps {
  workoutType: WorkoutType;
  exercises: Exercise[];
  onSave: (exercises: Exercise[]) => void;
}

export function ExerciseEditor({ workoutType, exercises, onSave }: ExerciseEditorProps) {
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: 10 });

  const handleAddExercise = () => {
    if (newExercise.name.trim()) {
      const exercise: Exercise = {
        id: `${Date.now()}`,
        name: newExercise.name as any,
        sets: newExercise.sets,
        reps: newExercise.reps,
        workoutType,
      };
      setLocalExercises([...localExercises, exercise]);
      setNewExercise({ name: '', sets: 3, reps: 10 });
      setShowAddForm(false);
    }
  };

  const handleUpdateExercise = (id: string, updates: Partial<Exercise>) => {
    setLocalExercises(
      localExercises.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
    );
  };

  const handleDeleteExercise = (id: string) => {
    setLocalExercises(localExercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    onSave(localExercises);
    setEditingId(null);
  };

  const workoutLabel = workoutType === 'push' ? 'Push' : workoutType === 'pull' ? 'Pull' : 'Legs';

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-accent">{workoutLabel} Day Exercises</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exercise List */}
          <div className="space-y-3">
            {localExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/30 hover:border-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{exercise.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingId(editingId === exercise.id ? null : exercise.id)}
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {editingId && (
            <Card className="bg-background border-accent/50">
              <CardContent className="pt-6 space-y-3">
                {localExercises
                  .filter(ex => ex.id === editingId)
                  .map(exercise => (
                    <div key={exercise.id} className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground">Exercise Name</label>
                        <Input
                          value={exercise.name}
                          onChange={(e) => handleUpdateExercise(exercise.id, { name: e.target.value as any })}
                          className="mt-1"
                          placeholder="Exercise name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground">Sets</label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={exercise.sets}
                            onChange={(e) => handleUpdateExercise(exercise.id, { sets: parseInt(e.target.value) || 1 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground">Reps</label>
                          <Input
                            type="number"
                            min="1"
                            max="50"
                            value={exercise.reps}
                            onChange={(e) => handleUpdateExercise(exercise.id, { reps: parseInt(e.target.value) || 1 })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => setEditingId(null)}
                        className="w-full bg-accent hover:bg-accent/90"
                      >
                        Done Editing
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Add Exercise Form */}
          {showAddForm && (
            <Card className="bg-background border-accent/50">
              <CardContent className="pt-6 space-y-3">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Exercise Name</label>
                  <Input
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="mt-1"
                    placeholder="Enter exercise name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Sets</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 3 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Reps</label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 10 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddExercise}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    Add Exercise
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="w-full border-accent/50 text-accent hover:bg-accent/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          )}

          {/* Save Button */}
          <Separator className="bg-border/30" />
          <Button
            onClick={handleSave}
            className="w-full bg-accent hover:bg-accent/90 text-background font-bold"
          >
            Save Workout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
