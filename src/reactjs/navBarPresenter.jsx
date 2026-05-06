import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import NavBarView from "../views/navBarView";
import { logoutUser } from "../firebase/auth";

const NavBar = observer(
    function navBarRender() {
        const navigate = useNavigate();
        
        const NAV_ITEMS = [
        { path: "/",        label: "Home"},
        { path: "/stats",   label: "Stats"},
        { path: "/train",   label: "Train"},
        { path: "/records", label: "Records"},
        { path: "/profile", label: "Profile"}
        ];

        function onLogoutACB() {
            void logoutUser();
        }
        
        function onNavigateACB(path) {
            navigate(path);
        }

        return <NavBarView NAV_ITEMS={NAV_ITEMS} onLogout={onLogoutACB} onNavigate={onNavigateACB} />;
    }
)

export {NavBar}