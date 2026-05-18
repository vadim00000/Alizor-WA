

import { useNavigate } from "react-router-dom";
import HomeSessionView from "./homeSessionView";

export default function HomeView(props) {
  const navigate = useNavigate();

  if (props.selectedSession) {
    return (
      <HomeSessionView
        session={props.selectedSession}
        onClose={props.onCloseSelectedSession}
      />
    );
  }

  return (
    <div className="home-container">

      <div className="home-hero">
        <h1 className="home-title">Welcome back, <span>Alizor.</span></h1>
        <p className="home-sub">Push your limits.</p>
      </div>

      <div className="home-stat-card">
        <p className="home-stat-label">This week</p>
        <p className="home-stat-number">{String(props.sessionsCount ?? 0)}</p>
        <p className="home-stat-unit">sessions completed</p>
      </div>

      <div>
        <button className="home-toggle" onClick={() => navigate("/train")}>Start workout <span className="home-start-plus">+</span></button>
        <button className="home-toggle" onClick={props.onToggleHistory}>
          {props.showHistory ? "Hide" : "Show"} history
          <span className={props.showHistory ? "home-toggle-arrow open" : "home-toggle-arrow"}>⌄</span>
        </button>


        {props.showHistory && (
          <ul className="home-list">
              {props.recentSessions.length === 0 ? (
              <p className="home-empty">No sessions in the last 7 days.</p>
            ) : (
              props.recentSessions.map((session, i) => (
                <li
                  key={session.id}
                  className="home-list-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => props.onSelectSession(session.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      props.onSelectSession(session.id);
                    }
                  }}
                >
                  <span className="home-list-index">{String(i + 1)}</span>
                  <span className="home-list-name">{session.templateName}</span>
                  <span className="home-list-date">
                    {new Date(session.performedAt).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short"
                    })}
                  </span>

                </li>
              ))
            )}
          </ul>
        )}
      </div>

    </div>
  );
}