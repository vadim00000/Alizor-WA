export function SessionLogView(props) {
    const session = props.session;

    return (
        <div>
            <h2>Logging session: {session.templateName}</h2>
            <p>Started at {new Date(session.performedAt).toLocaleString()}</p>

            <ul>
                {session.exercises.map((ex) => (
                    <li key={ex.id}>
                        <div>{ex.name}</div>
                        <ul>
                            {ex.sets.map((s, i) => (
                                <li key={i}>
                                    <span>Set {i + 1}</span>
                                    <input
                                        type="number"
                                        placeholder="kg"
                                        value={s.weight ?? ""}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex.id, i, {
                                                weight: e.target.value,
                                            })
                                        }
                                    />
                                    <span>kg</span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={s.reps}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex.id, i, {
                                                reps: e.target.value,
                                            })
                                        }
                                    />
                                    <span>reps</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div>
                <button
                    type="button"
                    onClick={props.onSaveSession}
                    disabled={props.saveInProgress}
                >
                    {props.saveInProgress ? "Saving..." : "Save session"}
                </button>

                <button type="button" onClick={props.onCancelSession}>
                    Cancel
                </button>
            </div>

            {props.saveError && (
                <p>
                    Could not save session:{" "}
                    {props.saveError?.message ?? String(props.saveError)}
                </p>
            )}
        </div>
    );
}
