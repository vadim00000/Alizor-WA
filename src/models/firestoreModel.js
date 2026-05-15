import { reaction } from "mobx";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs} from "firebase/firestore";
import { db } from "../firebase/config";
import { resolvePromise } from "../resolvePromise";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

let trainPersistenceConnected = false;
let profilePersistenceConnected = false;

/**
 * Connect train model to Firestore lifecycle using MobX reaction.
 * It reloads workouts whenever auth user changes.
 */
export function connectToPersistence(model, sessionModel, watchFunction = reaction) {
  if (trainPersistenceConnected) return;
  trainPersistenceConnected = true;

  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      model.currentUserId = userId;
      
      if (userId) {
        const promise = getDocs(collection(db, "users", userId, "workouts")).then((snapshot) => {
          const loaded = snapshot.docs.map((d) => d.data());
          model.setWorkouts(loaded);
          return loaded;
        });
        
        resolvePromise(promise, model.loadWorkoutsPromiseState);
      } else {
        model.setWorkouts([]);
        model.loadWorkoutsPromiseState = {};
      }
    },
    { fireImmediately: true }
  );

  watchFunction(
    () => model.workoutToSave,
    (workout) => {
      const userId = sessionModel.user?.uid;
      
      if (userId && workout) {
        const promise = setDoc(doc(db, "users", userId, "workouts", String(workout.id)), workout)
          .then(() => {
             model.workoutToSave = null; 
             return workout;
          });

        resolvePromise(promise, model.saveWorkoutPromiseState);
      }
    }
  );

  watchFunction(
    () => model.workoutToDeleteId,
    (workoutId) => {
      const userId = sessionModel.user?.uid;
      
      if (userId && workoutId) {
        const promise = deleteDoc(doc(db, "users", userId, "workouts", String(workoutId)))
          .then(() => {
             model.workoutToDeleteId = null;
             return workoutId;
          });

        resolvePromise(promise, model.saveWorkoutPromiseState);
      }
    }
  );

}

/**
 * Load user profile document when auth user changes.
 */
export function connectProfilePersistence(model, sessionModel, watchFunction = reaction) {
  if (profilePersistenceConnected) return;
  profilePersistenceConnected = true;

  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      model.setCurrentUserId(userId);
      
      if (userId) {
        const promise = getDoc(doc(db, "users", userId)).then((snap) => {
          if (snap.exists()) {
             model.setProfileData(snap.data());
          } else {
             model.setProfileData(null);
          }
          return snap;
        });
        
        resolvePromise(promise, model.loadProfilePromiseState);
      } else {
        model.setProfileData(null);
      }
    },
    { fireImmediately: true }
  );

  watchFunction(
    () => model.setToSave,
    (shouldSave) => {
      const userId = sessionModel.user?.uid;
      if (userId && shouldSave) {
        const profileData = {
          age: model.age,
          sex: model.sex,
          weightKg: model.weightKg,
          targetWeightKg: model.targetWeightKg,
        };

        const promise = setDoc(doc(db, "users", userId), profileData, { merge: true })
          .then(() => {
            model.setToSave = false;
            return profileData;
          });

        resolvePromise(promise, model.saveProfilePromiseState);
      }
    }
  );
}

export function connectAuthPersistence(sessionModel) {
  onAuthStateChanged(auth, (firebaseUser) => {
    sessionModel.setSession(firebaseUser);
  });
}
