export function ExercisesView({ exercises, onAddExercise }) {
    return (
        <div>
            <h3>Available Exercises</h3>

            <ul>
                {exercises.map(ex => (
                    <li key={ex.id}>
                        <div>{ex.name}</div>

                        {ex.gifUrl && (
                            <img src={ex.gifUrl} width="100" alt={ex.name}/>
                        )}

                        <button onClick={() => onAddExercise(ex)}>
                            +
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}