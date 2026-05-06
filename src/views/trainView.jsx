import { BodyPartsView } from "./bodyPartsView";
import { ExercisesView } from "./exercisesView";
import { WorkoutView } from "./workoutView";
import { WorkoutsView } from "./workoutsView";
import { SuspenseView } from "./suspenseView";

function TrainView(props) {

    return (
        <>
            <input
                placeholder="New workout name"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        props.onCreateWorkout(e.target.value);
                        e.target.value = "";
                    }
                }}
            />

            {props.workoutsLoading ? (
                <p>Loading workouts…</p>
            ) : (
                <WorkoutsView
                    workouts={props.workouts}
                    selectedWorkoutId={props.selectedWorkoutId}
                    onSelectWorkout={props.onSelectWorkout}
                />
            )}

            <button onClick={props.onSearch}>Load body parts</button>

            <h2>Body Parts</h2>
            {props.searchData ? (
                <BodyPartsView
                    bodyParts={props.searchData}
                    onSelectBodyPart={props.onSelectBodyPart}
                />
            ) : (
                <SuspenseView
                    promise={props.searchPromise}
                    error={props.searchError}
                />
            )}

            <h2>Exercises</h2>
            {props.exercisesData ? (
                <ExercisesView
                    exercises={props.exercisesData}
                    onAddExercise={props.onAddExercise}
                />
            ) : (
                <div>Select a body part</div>
            )}

            {!props.workoutsLoading && (
                <>
                    <WorkoutView
                        workoutName={props.selectedWorkout?.name}
                        workout={props.selectedWorkout?.exercises || []}
                        onRemoveExercise={props.onRemoveExercise}
                        onUpdateSet={props.onUpdateSet}
                        onAddSet={props.onAddSet}
                        onRemoveSet={props.onRemoveSet}
                        onRemoveWorkout={props.onRemoveWorkout}
                    />
                    
                    {props.selectedWorkout && (
                        <button type="button" onClick={props.onRemoveWorkout}>
                            Delete workout
                        </button>
                    )}
                    
                    {props.selectedWorkout && !props.saveInProgress && (
                        <button
                            type="button"
                            onClick={props.onSaveWorkout}
                        >
                            Save my workout
                        </button>
                    )}
                    
                    {props.saveWorkoutError && (
                        <div>
                            Could not save workout:{" "}
                            {props.saveWorkoutError?.message ?? String(props.saveWorkoutError)}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export { TrainView };