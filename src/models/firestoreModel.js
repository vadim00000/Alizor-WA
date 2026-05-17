import { reaction } from "mobx";
import { subscribeAuth } from "../persistence/sessionPersistence";

let authSessionConnected = false;
let trainPersistenceConnected = false;
let profilePersistenceConnected = false;

export function connectAuthSession(sessionModel) {
  if (authSessionConnected) return;
  authSessionConnected = true;

  subscribeAuth((firebaseUser) => {
    sessionModel.setSession(firebaseUser);
  });
}

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

export function connectStatsPersistence(statsModel, sessionModel, watchFunction = reaction) {
  // Keep idempotent
  if (!statsModel || !sessionModel) return;

  // Watch for user changes and load stats for user
  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      statsModel.currentUserId = userId;
      if (userId) {
        // delegate loading to the model (which may call persistence layer)
        try { statsModel.loadStats(userId); } catch (e) { console.warn('statsModel.loadStats failed', e); }
      }
    },
    { fireImmediately: true }
  );

  // Watch for changes in statsModel and persist them
  watchFunction(
    () => [statsModel.sessions.length, statsModel.totalVolume, JSON.stringify(statsModel.musclePercentages)],
    () => {
      const uid = sessionModel.user?.uid;
      if (!uid) return;
      try { statsModel.saveStats(uid); } catch (e) { console.warn('statsModel.saveStats failed', e); }
    }
  );
}
