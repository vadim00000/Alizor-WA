export function TemplatesView(props) {
    return (
        <div>
            <h3>My session templates</h3>

            {props.templates.length === 0 ? (
                <p>No template yet. Create one above.</p>
            ) : (
                <ul>
                    {props.templates.map((t) => (
                        <li key={t.id}>
                            <button
                                type="button"
                                style={{
                                    fontWeight:
                                        t.id === props.selectedTemplateId
                                            ? "bold"
                                            : "normal",
                                }}
                                onClick={() => props.onSelectTemplate(t.id)}
                            >
                                {t.name} ({t.exercises.length} exos)
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
