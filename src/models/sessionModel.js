import { makeAutoObservable } from "mobx";

export const sessionModel = {
  user: null,
  authReady: false,

  setSession(firebaseUser) {
    this.user = firebaseUser;
    this.authReady = true;
  },
};

makeAutoObservable(sessionModel);
