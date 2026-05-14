import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function listWorkouts(userId) {
  return getDocs(collection(db, "users", userId, "workouts")).then(
    (snapshot) => snapshot.docs.map((d) => d.data())
  );
}

export function putWorkout(userId, workout) {
  return setDoc(
    doc(db, "users", userId, "workouts", String(workout.id)),
    workout
  );
}

export function deleteWorkout(userId, workoutId) {
  return deleteDoc(doc(db, "users", userId, "workouts", String(workoutId)));
}
