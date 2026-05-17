export default function HomeView(props) {
  return (
    <div>
        <h1>Welcome Alizor</h1>
        <p>Push your limits.</p>

        <div>
            <h2>This week's recap</h2>
            <ul>
                <li><strong>Sessions:</strong> {props.sessionsCount}</li>
            </ul>
        </div>

        <hr />

        <div>
            <button onClick={props.onToggleHistory}>
                {props.showHistory ? "Hide" : "Show"} weekly history
            </button>

            {props.showHistory && (
                <div>
                    {props.recentSessions.length === 0 ? (
                        <p>No session recorded in the last 7 days.</p>
                    ) : (
                        <ul>
                            {props.recentSessions.map((session) => (
                                <li key={session.id}>
                                    {session.templateName} —{" "}
                                    {new Date(session.performedAt).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}