export function AuthView(props) {
    const isSignup = props.mode === "signup";

    function emailChangeACB(evt) {
        props.onEmailChange(evt.target.value);
    }
    function passwordChangeACB(evt) {
        props.onPasswordChange(evt.target.value);
    }
    function usernameChangeACB(evt) {
        props.onUsernameChange(evt.target.value);
    }
    function onSubmitACB(evt) {
        evt.preventDefault();
        props.onSubmit();
    }
    function onLoginModeACB() {
        props.onModeChange("login");
    }
    function onSignupModeACB() {
        props.onModeChange("signup");
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-header">
                <h1 className="auth-logo">ALIZOR</h1>
                <p className="auth-tagline">Track your workouts</p>
            </div>

            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab${!isSignup ? " active" : ""}`}
                        onClick={onLoginModeACB}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`auth-tab${isSignup ? " active" : ""}`}
                        onClick={onSignupModeACB}
                    >
                        Signup
                    </button>
                </div>

                <form onSubmit={onSubmitACB} className="auth-form">
                    {isSignup && (
                        <div className="auth-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={props.usernameInput || ""}
                                onChange={usernameChangeACB}
                                placeholder="Your username"
                                autoComplete="username"
                                disabled={props.loading}
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={props.emailInput || ""}
                            onChange={emailChangeACB}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={props.loading}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={props.passwordInput || ""}
                            onChange={passwordChangeACB}
                            placeholder={isSignup ? "At least 6 characters" : "••••••••"} 
                            autoComplete={isSignup ? "new-password" : "current-password"}
                            disabled={props.loading}
                        />
                    </div>

                    {props.error && (
                        <p className="auth-error">{props.error}</p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={props.loading}
                    >
                        {props.loading
                            ? "Loading..."
                            : isSignup ? "Create account" : "Login"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}
