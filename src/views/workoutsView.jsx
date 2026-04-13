export function WorkoutsView(props) {
    return (
        <div>
            <h3>Workouts</h3>

            <ul>
                {props.workouts.map(w => (
                    <li key={w.id}>
                        <button
                            style={{
                                fontWeight: w.id === props.selectedWorkoutId ? "bold" : "normal"
                            }}
                            onClick={() => props.onSelectWorkout(w.id)}
                        >
                            {w.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
