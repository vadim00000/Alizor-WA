import { makeAutoObservable } from 'mobx';

// MobX-backed train store. This mirrors the simple model shape you provided
// but uses observables and exposes a subscribe/notify API so non-MobX code
// (like StatsContext) can listen for events such as `workoutSaved`.
export class TrainStore {
  exercises = [];
  searchResults = [];
  currentExerciseID = null;
  _subscribers = new Set();

  // Additional stats fields requested
  monthlyData = [];
  sessions = [];
  totalTime = 0; // hours
  bestStreak = 0; // days
  totalVolume = 0;
  totalSessions = 0;
  avgPerWeek = 0;
  prs = [];
  // Per-muscle adjustment values (percent points). Used to tweak displayed
  // muscle percentages in the UI (e.g. to correct measurement bias).
  // Keys: Chest, Back, Shoulders, Biceps, Triceps, Legs, Core, Glutes
  muscleAdjustments = {
    Chest: 0,
    Back: 0,
    Shoulders: 0,
    Biceps: 0,
    Triceps: 0,
    Legs: 0,
    Core: 0,
    Glutes: 0,
  };

  constructor(initial = {}) {
    // initialize from provided initial state when available
    this.exercises = initial.exercises ?? [];
    this.searchResults = initial.searchResults ?? [];
    this.currentExerciseID = initial.currentExerciseID ?? null;
    this.monthlyData = initial.monthlyData ?? [];
    this.sessions = initial.sessions ?? [];
    this.totalTime = initial.totalTime ?? 0;
    this.bestStreak = initial.bestStreak ?? 0;
    this.totalVolume = initial.totalVolume ?? 0;
    this.totalSessions = initial.totalSessions ?? (this.sessions.length || 0);
    this.avgPerWeek = initial.avgPerWeek ?? 0;
    this.prs = initial.prs ?? [];

    makeAutoObservable(this, {}, { autoBind: true });
  }

  subscribe(cb) {
    this._subscribers.add(cb);
    return () => this._subscribers.delete(cb);
  }

  notify(event) {
    try {
      this._subscribers.forEach((cb) => cb(event));
    } catch (e) {
      console.error('TrainStore notify error', e);
    }
  }

  setCurrentExerciseId(exerciseId) {
    this.currentExerciseID = exerciseId;
    this.notify({ type: 'currentExerciseChanged', exerciseId });
  }

  // Muscle adjustments API
  setMuscleAdjustment(muscle, value) {
    // keep immutability so MobX picks up change
    this.muscleAdjustments = { ...this.muscleAdjustments, [muscle]: value };
    this.notify({ type: 'muscleAdjustmentChanged', muscle, value });
  }

  setMuscleAdjustments(obj) {
    this.muscleAdjustments = { ...this.muscleAdjustments, ...obj };
    this.notify({ type: 'muscleAdjustmentsChanged', adjustments: obj });
  }

  resetMuscleAdjustments() {
    this.muscleAdjustments = {
      Chest: 0, Back: 0, Shoulders: 0, Biceps: 0, Triceps: 0, Legs: 0, Core: 0, Glutes: 0,
    };
    this.notify({ type: 'muscleAdjustmentsReset' });
  }

  // Given a base percentages map { muscle: pct }, return adjusted map (clamped 0-100)
  computeAdjustedPercentages(base = {}) {
    const result = {};
    for (const m of Object.keys(this.muscleAdjustments)) {
      const baseVal = base[m] ?? 0;
      const adj = this.muscleAdjustments[m] ?? 0;
      let v = Math.round(baseVal + adj);
      if (v < 0) v = 0;
      if (v > 100) v = 100;
      result[m] = v;
    }
    // include any other muscles present in base but not in adjustments
    for (const m of Object.keys(base)) {
      if (!(m in result)) result[m] = Math.max(0, Math.min(100, Math.round(base[m] || 0)));
    }
    return result;
  }

  addToWorkout(exerciseToAdd) {
    this.exercises = [...this.exercises, exerciseToAdd];
    this.notify({ type: 'exerciseAdded', exercise: exerciseToAdd });
  }

  removeFromWorkout(exerciseToRemove) {
    this.exercises = this.exercises.filter(e => e.id !== exerciseToRemove.id);
    this.notify({ type: 'exerciseRemoved', exercise: exerciseToRemove });
  }

  setSearchResults(results) {
    this.searchResults = results;
    this.notify({ type: 'searchResults', results });
  }

  // Convert current exercises to a session and notify listeners.
  saveWorkout(date = new Date()) {
    const sessionDate = date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    const session = {
      date: sessionDate,
      muscles: Array.from(new Set(this.exercises.flatMap(e => e.muscles || []))),
      volume: this.exercises.reduce((s, e) => s + (e.volume || 0), 0),
      duration: this.exercises.reduce((s, e) => s + (e.duration || 0), 0),
      calories: this.exercises.reduce((s, e) => s + (e.calories || 0), 0),
      exercises: this.exercises,
    };

    this.notify({ type: 'workoutSaved', session });

    // clear current exercises after saving
    this.exercises = [];
    this.notify({ type: 'workoutCleared' });

    return session;
  }
}

export default TrainStore;
