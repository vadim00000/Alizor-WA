export default function HomeSessionView(props) {
  const session = props.session;

  return (
    <div className="home-container">
      <div className="home-session-top">
        <div className="home-hero">
          <h1 className="home-title">{session.templateName}</h1>
          <p className="home-sub">{new Date(session.performedAt).toLocaleDateString("en-EN", {
            day: "numeric", month: "long", year: "numeric"
          })}</p>
        </div>

        <div className="home-stat-card">
          <p className="home-stat-label">Exercises</p>
          <p className="home-stat-number">{session.exercises.length}</p>
        </div>
      </div>

      <div className="home-session-exercises">
        <div className="home-session-section-head">
          <div>
            <p className="home-session-kicker">Workout recap</p>
            <h2 className="home-session-title">Exercises and sets</h2>
          </div>
          <button className="home-toggle home-toggle-inline" type="button" onClick={props.onClose}>
            Back to history
          </button>
        </div>

        <div className="home-ex-scroll">
          <ul className="home-ex-list">
            {session.exercises.map((ex) => (
              <li key={ex.id} className="home-ex-item">
                <div className="home-ex-item-head">
                  <div>
                    <div className="home-ex-name">{ex.name}</div>
                    <div className="home-ex-subtitle">Exercise details</div>
                  </div>
                  <div className="home-ex-badge">
                    {Array.isArray(ex.sets) ? ex.sets.length : ex.sets} sets
                  </div>
                </div>
                {Array.isArray(ex.sets) && (
                  <ul className="home-ex-sets">
                    {ex.sets.map((set, index) => (
                      <li key={index} className="home-ex-set-row">
                        <span className="home-ex-set-index">Set {index + 1}</span>
                        <span className="home-ex-set-value">
                          {set.weight != null ? `${set.weight} kg` : "-"} × {set.reps} reps
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
