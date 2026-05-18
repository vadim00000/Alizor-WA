export function SessionLogView(props) {
    const session = props.session;

    return (
        <div className="train-card">
            <div className="session-header">
                <h2>{session.templateName}</h2>
                <p className="session-timestamp">Started at {new Date(session.performedAt).toLocaleString()}</p>
            </div>

            <ul className="session-exercises-list">
                {session.exercises.map((ex) => (
                    <li key={ex.id}>
                        <div className="session-exercise-name">{ex.name}</div>
                        <ul className="session-sets-list">
                            {ex.sets.map((s, i) => (
                                <li key={i}>
                                    <span className="set-label">Set {i + 1}</span>
                                    <input
                                        type="number"
                                        placeholder="kg"
                                        className="set-input"
                                        value={s.weight ?? ""}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex.id, i, {
                                                weight: e.target.value,
                                            })
                                        }
                                    />
                                    <span className="set-unit">kg</span>
                                    <input
                                        type="number"
                                        min={1}
                                        className="set-input"
                                        value={s.reps}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex.id, i, {
                                                reps: e.target.value,
                                            })
                                        }
                                    />
                                    <span className="set-unit">reps</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="session-actions">
                <button
                    type="button"
                    className="session-button"
                    onClick={props.onSaveSession}
                    disabled={props.saveInProgress}
                >
                    {props.saveInProgress ? "Saving..." : "Save session"}
                </button>

                <button
                    type="button"
                    className="session-button cancel"
                    onClick={props.onCancelSession}
                >
                    Cancel
                </button>
            </div>

            {props.saveError && (
                <div className="session-error">
                    Could not save session:{" "}
                    {props.saveError?.message ?? String(props.saveError)}
                </div>
            )}
        </div>
    );
}
