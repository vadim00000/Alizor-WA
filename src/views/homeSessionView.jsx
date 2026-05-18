export default function HomeSessionView(props) {
  const session = props.session;

  return (
    <div className="home-container">
      <div className="home-session-top">
        <div className="home-hero">
          <h1 className="home-title">{session.templateName}</h1>
          <p className="home-sub">Session du {new Date(session.performedAt).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric"
          })}</p>
        </div>

        <div className="home-stat-card">
          <p className="home-stat-label">Exercises</p>
          <p className="home-stat-number">{session.exercises.length}</p>
        </div>
      </div>

      <div className="home-session-exercises">
        <button className="home-toggle" type="button" onClick={props.onClose}>
          Back to history
        </button>

        <div className="home-ex-scroll">
          <ul className="home-ex-list">
            {session.exercises.map((ex) => (
              <li key={ex.id} className="home-ex-item">
                <div>
                  <div className="home-ex-name">{ex.name}</div>
                  <div className="home-ex-detail">
                    {Array.isArray(ex.sets) ? ex.sets.length : ex.sets} sets
                  </div>
                </div>
                {Array.isArray(ex.sets) && (
                  <ul className="home-ex-sets">
                    {ex.sets.map((set, index) => (
                      <li key={index}>
                        Set {index + 1}: {set.weight != null ? `${set.weight} kg` : "-"} × {set.reps} reps
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
