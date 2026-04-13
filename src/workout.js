import { exampleExercise } from "./exercise.js";

/**
 * One set: load (kg) and repetitions.
 * @typedef {{ weight: number | null, reps: number }} SetEntry
 */

/**
 * Exercise inside a workout: exercise fields plus a list of sets (weight / reps).
 * @typedef {import("./exercise.js").Exercise & { sets: SetEntry[] }} WorkoutExercise
 */

/**
 * Workout session: id, display name, list of exercises.
 * @typedef {{ id: number, name: string, createdAt: number, exercises: WorkoutExercise[] }} Workout
 */

/** Creates a new empty workout with a generated id. */
export function createEmptyWorkout(name) {
  const now = Date.now();
  return {
    id: now,
    createdAt: now,
    name: name.trim(),
    exercises: [],
  };
}

/**
 * Wraps an API exercise with default empty sets (weight null until filled in).
 * @param {object} exercise
 * @param {number} [defaultSetCount=3]
 * @returns {WorkoutExercise}
 */
export function createWorkoutExerciseFromApi(exercise, defaultSetCount = 3) {
  return {
    ...exercise,
    sets: Array.from({ length: defaultSetCount }, () => ({
      weight: null,
      reps: 8,
    })),
  };
}

/** Sample workout with one exercise and three weight × reps sets. */
export const exampleWorkout = {
  id: 1001,
  name: "Leg day",
  exercises: [
    {
      ...exampleExercise,
      sets: [
        { weight: 40, reps: 12 },
        { weight: 45, reps: 10 },
        { weight: 50, reps: 8 },
      ],
    },
  ],
};
