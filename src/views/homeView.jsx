// src/views/homeView.jsx
export default function HomeView(props) {
  return (
    <div>
        <h1>Welcome Alizor</h1>
        <p>Push your limits.</p>

        <div>
            <h2>This week's recap</h2>
            <ul>
                <li><strong>Sessions:</strong> {props.workoutsCount}</li>
            </ul>
        </div>

        <hr />

        <div>
            <button onClick={props.onToggleHistory}>
                {props.showHistory ? "Hide" : "Show"} weekly history
            </button>

            {props.showHistory && (
                <div>
                    {props.recentWorkouts.length === 0 ? (
                        <p>No workouts recorded in the last 7 days.</p>
                    ) : (
                        <ul>
                            {props.recentWorkouts.map(session => (
                                <li key={session.id}>
                                    {new Date(session.createdAt).toLocaleDateString()}
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