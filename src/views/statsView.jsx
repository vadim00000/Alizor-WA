export default function StatsView(props) {
    return (
        <div>
            <h1>Stats</h1>
            <p>Total sessions logged: {props.totalSessions}</p>

            <h2>Sessions per template</h2>

            {props.stats.length === 0 ? (
                <p>No template yet. Create one in the Train tab.</p>
            ) : (
                <ul>
                    {props.stats.map((entry) => (
                        <li key={entry.templateId}>
                            <strong>{entry.templateName}</strong>
                            {!entry.exists && " (deleted)"}: {entry.count}{" "}
                            {entry.count === 1 ? "session" : "sessions"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
