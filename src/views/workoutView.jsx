export function WorkoutView(props) {
    return (
        <div>
            <h3>Your Workout</h3>

            <ul>
                {props.workout.map(ex => (
                 <li key={ex.id || ex.name}>
                        {ex.name} — {ex.sets} x {ex.reps}

                        <button onClick={() => props.onRemoveExercise(ex)}>
                            x
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}