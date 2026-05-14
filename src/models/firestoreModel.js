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
