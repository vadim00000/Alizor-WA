export function TemplateEditorView(props) {
    const template = props.template;

    if (!template) {
        return (
            <div>
                <h3>No template selected</h3>
                <p>Select an existing template or create a new one.</p>
            </div>
        );
    }

    return (
        <div>
            <h3>Editing: {template.name}</h3>

            {template.exercises.length === 0 ? (
                <p>No exercise yet. Pick one from the body parts search.</p>
            ) : (
                <ul>
                    {template.exercises.map((ex) => (
                        <li key={ex.id}>
                            <div>{ex.name}</div>
                            <label>
                                Sets:{" "}
                                <input
                                    type="number"
                                    min={1}
                                    value={ex.sets}
                                    onChange={(e) =>
                                        props.onSetExerciseSets(
                                            ex.id,
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => props.onRemoveExercise(ex)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <button
                    type="button"
                    onClick={props.onSaveTemplate}
                    disabled={props.saveInProgress}
                >
                    {props.saveInProgress ? "Saving..." : "Save template"}
                </button>

                <button
                    type="button"
                    onClick={props.onStartSession}
                    disabled={template.exercises.length === 0}
                >
                    Start session
                </button>

                <button type="button" onClick={props.onRemoveTemplate}>
                    Delete template
                </button>
            </div>

            {props.saveError && (
                <p>
                    Could not save template:{" "}
                    {props.saveError?.message ?? String(props.saveError)}
                </p>
            )}
        </div>
    );
}
