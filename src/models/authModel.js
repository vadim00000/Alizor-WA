import { login, signup } from "../firebase/auth";

export const authModel = {
  mode: "login", // "login" or "signup"
  emailInput: "",
  passwordInput: "",
  usernameInput: "",
  error: null,
  loading: false,

  setMode(newMode) {
    this.mode = newMode;
    this.error = null;
  },

  setEmailInput(newEmailInput) {
    this.emailInput = newEmailInput;
    this.error = null;
  },

  setPasswordInput(newPasswordInput) {
    this.passwordInput = newPasswordInput;
    this.error = null;
  },

  setUsernameInput(newUsernameInput) {
    this.usernameInput = newUsernameInput;
    this.error = null;
  },

  isEmailInputValid() {
    const emailInput = this.emailInput;
    if (!emailInput || typeof emailInput !== "string") {
      return false;
    }

    const atIndex = emailInput.indexOf("@");
    const dotIndex = emailInput.lastIndexOf(".");

    if (
      atIndex === -1 ||
      dotIndex === -1 ||
      atIndex === 0 ||
      dotIndex <= atIndex + 1 ||
      dotIndex === emailInput.length - 1 ||
      [...emailInput].filter((c) => c === "@").length !== 1 ||
      ![...emailInput].every((c) => /[a-zA-Z0-9@._+-]/.test(c)) ||
      emailInput.includes("..")
    ) {
      return false;
    }

    return true;
  },

  async submit() {
    if (!this.isEmailInputValid()) {
      this.error = "Invalid email format";
      return;
    }
    if (!this.passwordInput || this.passwordInput.length < 6) {
      this.error = "The password must be at least 6 characters long"; // Firebase requirement for password
      return;
    }
    if (this.mode === "signup" && !this.usernameInput.trim()) {
      this.error = "A username is required for signing up";
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      if (this.mode === "login") {
        await login(this.emailInput, this.passwordInput);
      } else {
        await signup(this.emailInput, this.passwordInput, this.usernameInput.trim());
      }
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
};
