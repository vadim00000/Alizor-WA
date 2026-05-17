export function BodyPartsView({ bodyParts, onSelectBodyPart }) {
    return (
        <ul className="body-parts-list">
            {bodyParts.map(bp => (
                <li key={bp}>
                    <button onClick={() => onSelectBodyPart(bp)}>
                        {bp}
                    </button>
                </li>
            ))}
        </ul>
    );
}