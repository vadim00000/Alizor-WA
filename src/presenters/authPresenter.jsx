import { AuthView } from "../views/authView"
import { observer } from "mobx-react-lite";

const AuthPresenter = observer(
    function AuthPresenterRender(props) {
        function setModeACB(newMode) {
            props.model.setMode(newMode);
        }
        function setEmailInputACB(newEmailInput) {
            props.model.setEmailInput(newEmailInput);
        }
        function setPasswordInputACB(newPasswordInput) {
            props.model.setPasswordInput(newPasswordInput);
        }
        function setUsernameInputACB(newUsernameInput) {
            props.model.setUsernameInput(newUsernameInput);
        }
        function onSubmitACB() {
            props.model.submit();
        }

        return <AuthView
            mode={props.model.mode}
            emailInput={props.model.emailInput}
            passwordInput={props.model.passwordInput}
            usernameInput={props.model.usernameInput}
            error={props.model.error}
            loading={props.model.loading}
            onModeChange={setModeACB}
            onEmailChange={setEmailInputACB}
            onPasswordChange={setPasswordInputACB}
            onUsernameChange={setUsernameInputACB}
            onSubmit={onSubmitACB}
        />;
    }
);

export { AuthPresenter };