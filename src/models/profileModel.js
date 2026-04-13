import { makeAutoObservable } from "mobx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { resolvePromise } from "../resolvePromise";

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

  loadProfile(userId = this.currentUserId) {
    this.currentUserId = userId ?? null;
    if (!userId) {
      this._resetFields();
      this.loadProfilePromiseState = {};
      return;
    }

    resolvePromise(
      getDoc(doc(db, "users", userId)).then((snap) => {
        const data = snap.data();
        if (data) {
          this.age = data.age ?? null;
          this.sex = data.sex ?? null;
          this.weightKg = data.weightKg ?? null;
          this.targetWeightKg = data.targetWeightKg ?? null;
        } else {
          this._resetFields();
        }
        return snap;
      }),
      this.loadProfilePromiseState
    );
  },

  saveProfile(userId = this.currentUserId) {
    if (!userId) return Promise.resolve();

    const payload = {
      age: this.age,
      sex: this.sex,
      weightKg: this.weightKg,
      targetWeightKg: this.targetWeightKg,
    };

    const promise = setDoc(
      doc(db, "users", userId),
      payload,
      { merge: true }
    );
    resolvePromise(promise, this.saveProfilePromiseState);
    return promise;
  },
};

makeAutoObservable(profileModel);
