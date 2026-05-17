export const profileModel = {
  age: null,
  sex: null,
  weightKg: null,
  targetWeightKg: null,
  // array of { ts: number, weightKg: number }
  weightHistory: [],
  currentUserId: null,

  loadProfilePromiseState: {},
  saveProfilePromiseState: {},

  setToSave: false,

  _resetFields() {
    this.age = null;
    this.sex = null;
    this.weightKg = null;
    this.targetWeightKg = null;
    this.weightHistory = [];
    this.setToSave = false;
    this.loadProfilePromiseState = {};
  },

  setProfileData(data) {
    if (data) {
      this.age = data.age ?? null;
      this.sex = data.sex ?? null;
      this.weightKg = data.weightKg ?? null;
      this.targetWeightKg = data.targetWeightKg ?? null;
      this.weightHistory = Array.isArray(data.weightHistory) ? data.weightHistory.slice() : [];
    } else {
      this._resetFields();
    }
  },

  setAge(age) {
    this.age = age;
  },

  setSex(sex) {
    this .sex = sex;
  },

  setWeightKg(weightKg) {
    this.weightKg = weightKg;
  },

  setTargetWeightKg(targetWeightKg) {
    this.targetWeightKg = targetWeightKg;
  },

  setSave() {
    this.setToSave = true;
  },

  setCurrentUserId(userId) {
    this.currentUserId = userId ?? null;
    if (!userId) {
      this._resetFields();
    }
  }

};
