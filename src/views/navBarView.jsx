import { NavLink } from "react-router-dom";
import { logoutUser } from "../firebase/auth";

const NAV_ITEMS = [
  { path: "/",        label: "Home"},
  { path: "/stats",   label: "Stats"},
  { path: "/train",   label: "Train"},
  { path: "/records", label: "Records"},
  { path: "/profile", label: "Profile"}
];

export default function NavBarView() {
  function onLogoutACB() {
    void logoutUser();
  }

  return (
    <nav className="navbar">
        <ul className="navbar-ul">
            {NAV_ITEMS.map(item => (
            <li key={item.path}>
                <NavLink to={item.path}>
                {item.label}
                </NavLink>
            </li>
        ))}
        <li>
          <button
            type="button"
            className="navbar-logout"
            onClick={onLogoutACB}
          >
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}