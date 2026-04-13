export function WorkoutView(props) {
    return (
        <div>
            <h3>Your workout</h3>
            <p>{props.workoutName || ""}</p>

            <ul>
                {props.workout.map((ex) => (
                    <li key={ex.id || ex.name}>
                        <div>{ex.name}</div>
                        <ul>
                            {ex.sets.map((s, i) => (
                                <li key={i}>
                                    <span>Set {i + 1}</span>
                                    <input
                                        type="number"
                                        value={s.weight ?? ""}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex, i, {
                                                weight: e.target.value,
                                            })
                                        }
                                    />
                                    <span>kg</span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={s.reps}
                                        onChange={(e) =>
                                            props.onUpdateSet(ex, i, {
                                                reps: e.target.value,
                                            })
                                        }
                                    />
                                    <span>reps</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onRemoveSet(ex, i)
                                        }
                                        disabled={ex.sets.length <= 1}
                                    >
                                        −
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => props.onAddSet(ex)}
                        >
                            + set
                        </button>
                        <button
                            type="button"
                            onClick={() => props.onRemoveExercise(ex)}
                        >
                            x
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
