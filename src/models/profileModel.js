import { makeAutoObservable } from "mobx";

export const profileModel = {
  age: null,
  sex: null,
  weightKg: null,
  targetWeightKg: null,
  currentUserId: null,

  loadProfilePromiseState: {},
  saveProfilePromiseState: {},

  drafts: {
    age: null,
    sex: null,
    weightKg: null,
    targetWeightKg: null,
  },

  setDraft(field, value) {
    this.drafts[field] = value;
  },

  commitChanges() {
    this.age = this.drafts.age;
    this.sex = this.drafts.sex;
    this.weightKg = this.drafts.weightKg;
    this.targetWeightKg = this.drafts.targetWeightKg;
  },

  _resetFields() {
    this.age = null;
    this.sex = null;
    this.weightKg = null;
    this.targetWeightKg = null;
    this.drafts = {
      age: null,
      sex: null,
      weightKg: null,
      targetWeightKg: null,
    };
    this.loadProfilePromiseState = {};
  },

  setProfileData(data) {
    if (data) {
      this.age = data.age ?? null;
      this.sex = data.sex ?? null;
      this.weightKg = data.weightKg ?? null;
      this.targetWeightKg = data.targetWeightKg ?? null;
      
      this.drafts = {
        age: this.age,
        sex: this.sex,
        weightKg: this.weightKg,
        targetWeightKg: this.targetWeightKg,
      };
    } else {
      this._resetFields();
    }
  },

  setCurrentUserId(userId) {
    this.currentUserId = userId ?? null;
    if (!userId) {
      this._resetFields();
    }
  }

};

makeAutoObservable(profileModel);
