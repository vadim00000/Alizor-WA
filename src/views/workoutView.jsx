export function WorkoutView({ workout, onRemoveExercise }) {
    return (
        <div>
            <h3>Your Workout</h3>

            <ul>
                {workout.map(ex => (
                    <li key={ex.id}>
                        {ex.name} — {ex.sets} x {ex.reps}

                        <button onClick={() => onRemoveExercise(ex)}>
                            x
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}