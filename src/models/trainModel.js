import { makeAutoObservable } from "mobx";
import { searchExercises, getExercisesByBodyPart } from "../exerciseSource";
import { resolvePromise } from "../resolvePromise";
import { createEmptyWorkout, createWorkoutExerciseFromApi } from "../workout";

export const trainModel = {
  workouts: [],
  selectedWorkoutId: null,
  currentUserId: null,

  selectedBodyPart: null,
  searchResultsPromiseState: {},
  exercisesPromiseState: {},
  loadWorkoutsPromiseState: {},
  saveWorkoutPromiseState: {},

  workoutToSave: null,  
  workoutToDeleteId: null,

  setWorkouts(loadedWorkouts) {
    this.workouts = loadedWorkouts;
    if (
      this.selectedWorkoutId != null &&
      !loadedWorkouts.some((w) => w.id === this.selectedWorkoutId)
    ) {
      this.selectedWorkoutId = null;
    }
  },

  createWorkout(name) {
    if (!name.trim()) return;

    const workout = createEmptyWorkout(name);
    this.workouts = [...this.workouts, workout];
    this.selectedWorkoutId = workout.id;
  },

  getWeekWorkouts() {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return this.workouts.filter((workout) => {
      const timestamp = Number(workout.createdAt);

      return Number.isFinite(timestamp) && timestamp >= oneWeekAgo;
    });
  },
  
  selectWorkout(id) {
    this.selectedWorkoutId = id;
  },

  getWorkout(id) {
        return this.workouts.find((workout) => workout.id === id);
    },

  addToWorkout(exercise) {
    if (this.selectedWorkoutId === null) return;

    this.workouts = this.workouts.map((w) => {
      if (w.id === this.selectedWorkoutId) {
        if (w.exercises.find((e) => e.id === exercise.id)) {
          return w;
        }

        return {
          ...w,
          exercises: [
            ...w.exercises,
            createWorkoutExerciseFromApi(exercise),
          ],
        };
      }
      return w;
    });
  },

  removeFromWorkout(exercise) {
    this.workouts = this.workouts.map((w) => {
      if (w.id === this.selectedWorkoutId) {
        return {
          ...w,
          exercises: w.exercises.filter((e) => e.id !== exercise.id),
        };
      }
      return w;
    });
  },

  updateSet(exercise, setIndex, patch) {
    if (this.selectedWorkoutId === null) return;

    let next = { ...patch };
    if ("weight" in next) {
      const raw = next.weight;
      const n = raw === "" || raw == null ? null : Number(raw);
      next.weight = n != null && Number.isFinite(n) ? n : null;
    }
    if ("reps" in next) {
      const r = Number(next.reps);
      next.reps = Number.isFinite(r) && r >= 1 ? r : 1;
    }

    this.workouts = this.workouts.map((w) => {
      if (w.id !== this.selectedWorkoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map((ex) => {
          if (ex.id !== exercise.id) return ex;
          const sets = ex.sets.map((s, i) =>
            i === setIndex ? { ...s, ...next } : s
          );
          return { ...ex, sets };
        }),
      };
    });
  },

  addSet(exercise) {
    if (this.selectedWorkoutId === null) return;
    this.workouts = this.workouts.map((w) => {
      if (w.id !== this.selectedWorkoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map((ex) => {
          if (ex.id !== exercise.id) return ex;
          return {
            ...ex,
            sets: [...ex.sets, { weight: null, reps: 8 }],
          };
        }),
      };
    });
  },

  removeSet(exercise, setIndex) {
    if (this.selectedWorkoutId === null) return;
    this.workouts = this.workouts.map((w) => {
      if (w.id !== this.selectedWorkoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map((ex) => {
          if (ex.id !== exercise.id) return ex;
          if (ex.sets.length <= 1) return ex;
          return {
            ...ex,
            sets: ex.sets.filter((_, i) => i !== setIndex),
          };
        }),
      };
    });
  },

  doSearch() {
    resolvePromise(searchExercises(), this.searchResultsPromiseState);
  },

  setBodyPart(bodyPart) {
    this.selectedBodyPart = bodyPart;

    resolvePromise(
      getExercisesByBodyPart(bodyPart),
      this.exercisesPromiseState
    );
  },

  loadWorkouts(userId = this.currentUserId) {
    if (!userId) {
      this.workouts = [];
      this.selectedWorkoutId = null;
      this.loadWorkoutsPromiseState = {};
      return;
    }

    resolvePromise(
      getDocs(collection(db, "users", userId, "workouts")).then((snapshot) => {
        const loaded = snapshot.docs.map((d) => d.data());

        this.workouts = loaded;
        if (
          this.selectedWorkoutId != null &&
          !loaded.some((w) => w.id === this.selectedWorkoutId)
        ) {
          this.selectedWorkoutId = null;
        }
        return loaded;
      }),
      this.loadWorkoutsPromiseState
    );
  },

  saveSelectedWorkout() {
    const workout = this.workouts.find((w) => w.id === this.selectedWorkoutId);
    if (workout) {
      this.workoutToSave = { ...workout };
    }
  },

   removeSelectedWorkout() {
    if (this.selectedWorkoutId === null) return;
    
    this.workoutToDeleteId = this.selectedWorkoutId;
    
    this.workouts = this.workouts.filter((w) => w.id !== this.selectedWorkoutId);
    this.selectedWorkoutId = null;
  }
};

makeAutoObservable(trainModel);
