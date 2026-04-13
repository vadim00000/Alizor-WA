import { reaction } from "mobx";

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
      model.loadWorkouts(userId);
    },
    { fireImmediately: true }
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
      model.loadProfile(userId);
    },
    { fireImmediately: true }
  );
}
