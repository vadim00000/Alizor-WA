export function BodyPartsView(props) {
    return (
        <ul>
            {props.bodyParts.map(bp => (
                <li key={bp}>
                    <button onClick={() => props.onSelectBodyPart(bp)}>
                        {bp}
                    </button>
                </li>
            ))}
        </ul>
    );
}