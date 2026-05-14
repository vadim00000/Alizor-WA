import { makeAutoObservable } from "mobx";
import { resolvePromise } from "../resolvePromise";
import {
  fetchUserProfile,
  saveUserProfile,
} from "../persistence/profilePersistence";

export const profileModel = {
  age: null,
  sex: null,
  weightKg: null,
  targetWeightKg: null,
  currentUserId: null,

  loadProfilePromiseState: {},
  saveProfilePromiseState: {},

  setAge(value) {
    this.age = value;
  },

  setSex(value) {
    this.sex = value;
  },

  setWeightKg(value) {
    this.weightKg = value;
  },

  setTargetWeightKg(value) {
    this.targetWeightKg = value;
  },

  _resetFields() {
    this.age = null;
    this.sex = null;
    this.weightKg = null;
    this.targetWeightKg = null;
  },

  applyProfileData(data) {
    if (data) {
      this.age = data.age ?? null;
      this.sex = data.sex ?? null;
      this.weightKg = data.weightKg ?? null;
      this.targetWeightKg = data.targetWeightKg ?? null;
    } else {
      this._resetFields();
    }
  },

  loadProfile(userId = this.currentUserId) {
    this.currentUserId = userId ?? null;
    if (!userId) {
      this._resetFields();
      this.loadProfilePromiseState = {};
      return;
    }

    const prms = fetchUserProfile(userId).then((data) => {
      this.applyProfileData(data);
      return data;
    });

    resolvePromise(prms, this.loadProfilePromiseState);
  },

  saveProfile(userId = this.currentUserId) {
    if (!userId) return Promise.resolve();

    const payload = {
      age: this.age,
      sex: this.sex,
      weightKg: this.weightKg,
      targetWeightKg: this.targetWeightKg,
    };

    const promise = saveUserProfile(userId, payload);
    resolvePromise(promise, this.saveProfilePromiseState);
    return promise;
  },
};

makeAutoObservable(profileModel);
