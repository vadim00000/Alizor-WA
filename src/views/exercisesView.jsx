export function ExercisesView({ exercises, onAddExercise }) {
    return (
        <div>
            <h3>Available Exercises</h3>

            <ul className="exercises-list">
                {exercises.map(ex => (
                    <li key={ex.id}>
                        <div className="exercise-name">{ex.name}</div>

                        {ex.gifUrl && (
                            <img src={ex.gifUrl} alt={ex.name} className="exercise-gif"/>
                        )}

                        <button
                            type="button"
                            onClick={() => onAddExercise(ex)}
                        >
                            +
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}