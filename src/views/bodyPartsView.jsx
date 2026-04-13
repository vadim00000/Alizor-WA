export function BodyPartsView({ bodyParts, onSelectBodyPart }) {
    return (
        <ul>
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