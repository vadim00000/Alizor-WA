export function ExercisesView(props) {
    return (
        <div>
            <h3>Available Exercises</h3>

            <ul>
                {props.exercises.map(ex => (
                    <li key={ex.id}>
                        <div>{ex.name}</div>

                        <button onClick={() => props.onAddExercise(ex)}>
                            +
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}