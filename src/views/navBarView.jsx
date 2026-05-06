export default function NavBarView(props) {

  return (
    <nav className="navbar">
        <ul className="navbar-ul">
            {props.NAV_ITEMS.map(item => (
            <li key={item.path}>
                <a 
                    href={item.path} 
                    onClick={(e) => {
                        e.preventDefault();
                        props.onNavigate(item.path);
                    }}
                >
                    {item.label}
                </a>
            </li>
        ))}
        <li>
          <button
            type="button"
            className="navbar-logout"
            onClick={props.onLogout}
          >
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}