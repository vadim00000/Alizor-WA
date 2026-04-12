// Simple in-memory model for training/workouts with a small observer API
// The user-provided shape was extended with subscribe/notify and a saveWorkout helper
export const model = {
  exercises: [],
  searchResults: [],
  currentExerciseID: null,
  _subscribers: new Set(),

  subscribe(cb) {
    this._subscribers.add(cb);
    return () => this._subscribers.delete(cb);
  },

  notify(event) {
    try {
      this._subscribers.forEach((cb) => cb(event));
    } catch (e) {
      console.error('trainModel notify error', e);
    }
  },

  setCurrentExerciseId(exerciseId) {
    this.currentExerciseID = exerciseId;
    this.notify({ type: 'currentExerciseChanged', exerciseId });
  },

  addToWorkout(exerciseToAdd) {
    this.exercises = [...this.exercises, exerciseToAdd];
    this.notify({ type: 'exerciseAdded', exercise: exerciseToAdd });
  },

  removeFromWorkout(exerciseToRemove) {
    function shouldWeKeepExerciseCB(exercise) {
      return exercise.id !== exerciseToRemove.id;
    }
    this.exercises = this.exercises.filter(shouldWeKeepExerciseCB);
    this.notify({ type: 'exerciseRemoved', exercise: exerciseToRemove });
  },

  setSearchResults(results) {
    this.searchResults = results;
    this.notify({ type: 'searchResults', results });
  },

  // Turn the current `exercises` array into a session object and notify subscribers.
  // This is a convenience to signal a finished workout to other parts of the app.
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

    // Notify listeners that a workout was saved
    this.notify({ type: 'workoutSaved', session });

    // Optionally clear the current workout
    this.exercises = [];
    this.notify({ type: 'workoutCleared' });

    return session;
  },
};

export default model;
