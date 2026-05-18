export function TemplatesView(props) {
    return (
        <div>
            {props.templates.length === 0 ? (
                <p className="templates-empty">No workout yet. Create one above.</p>
            ) : (
                <ul className="templates-list">
                    {props.templates.map((t) => (
                        <li key={t.id}>
                            <button
                                className={t.id === props.selectedTemplateId ? "selected" : ""}
                                type="button"
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
