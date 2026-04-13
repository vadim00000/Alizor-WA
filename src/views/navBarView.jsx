import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/",        label: "Home"},
  { path: "/stats",   label: "Stats"},
  { path: "/train",   label: "Train"},
  { path: "/records", label: "Records"},
  { path: "/profile", label: "Profile"}
];

export default function NavBarView() {
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
      </ul>
    </nav>
  );
}