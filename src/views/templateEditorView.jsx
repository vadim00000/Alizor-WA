export function TemplateEditorView(props) {
    const template = props.template;

    if (!template) {
        return (
            <div className="train-card">
                <div className="editor-header">
                    <h3>No template selected</h3>
                </div>
                <p className="editor-empty">Select an existing template or create a new one.</p>
            </div>
        );
    }

    return (
        <div className="train-card">
            <div className="editor-header">
                <h3>{template.name}</h3>
            </div>

            {template.exercises.length === 0 ? (
                <p className="editor-empty">No exercise yet. Pick one from the body parts search.</p>
            ) : (
                <ul className="editor-exercises-list">
                    {template.exercises.map((ex) => (
                        <li key={ex.id}>
                            <div className="exercise-editor-name">{ex.name}</div>
                            <div className="exercise-editor-sets">
                                <label>Sets:</label>
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
                            </div>
                            <button
                                type="button"
                                className="exercise-editor-remove"
                                onClick={() => props.onRemoveExercise(ex)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="editor-actions">
                <button
                    type="button"
                    className="editor-button"
                    onClick={props.onSaveTemplate}
                    disabled={props.saveInProgress}
                >
                    {props.saveInProgress ? "Saving..." : "Save template"}
                </button>

                <button
                    type="button"
                    className="editor-button"
                    onClick={props.onStartSession}
                    disabled={template.exercises.length === 0}
                >
                    Start session
                </button>

                <button
                    type="button"
                    className="editor-button delete"
                    onClick={props.onRemoveTemplate}
                >
                    Delete template
                </button>
            </div>

            {props.saveError && (
                <div className="editor-error">
                    Could not save template:{" "}
                    {props.saveError?.message ?? String(props.saveError)}
                </div>
            )}
        </div>
    );
}
