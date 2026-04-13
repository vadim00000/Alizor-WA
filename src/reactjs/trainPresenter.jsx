import { observer } from "mobx-react-lite";
import { BodyPartsView } from "../views/bodyPartsView";
import { ExercisesView } from "../views/exercisesView";
import { WorkoutView } from "../views/workoutView";
import { WorkoutsView } from "../views/workoutsView";
import { SuspenseView } from "../views/suspenseView";

const Train = observer(function TrainRender(props){

    const model = props.model;

    function searchACB(){
        model.doSearch();
    }

    function selectBodyPartACB(bodyPart){
        model.setBodyPart(bodyPart);
    }

    function addExerciseACB(ex){
        model.addToWorkout(ex);
    }

    function removeExerciseACB(ex){
        model.removeFromWorkout(ex);
    }

    function createWorkoutACB(name){
        model.createWorkout(name);
    }

    function selectWorkoutACB(id){
        model.selectWorkout(id);
    }

    const selectedWorkout = model.workouts.find(
        w => w.id === model.selectedWorkoutId
    );

    function bodyPartsOrSuspense(){
        const state = model.searchResultsPromiseState;

        if(state.data){
            return (
                <BodyPartsView
                    bodyParts={state.data}
                    onSelectBodyPart={selectBodyPartACB}
                />
            );
        }

        return (
            <SuspenseView
                promise={state.promise}
                error={state.error}
            />
        );
    }

    function exercisesOrSuspense(){
        const state = model.exercisesPromiseState;

        if(state.data){
            return (
                <ExercisesView
                    exercises={state.data}
                    onAddExercise={addExerciseACB}
                />
            );
        }

        return <div>Select a body part</div>;
    }

    return (
        <>

            <input
                placeholder="New workout name"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        createWorkoutACB(e.target.value);
                        e.target.value = "";
                    }
                }}
            />

            <WorkoutsView
                workouts={model.workouts}
                selectedWorkoutId={model.selectedWorkoutId}
                onSelectWorkout={selectWorkoutACB}
            />

            <button onClick={searchACB}>
                Load body parts
            </button>

            <h2>Body Parts</h2>
            {bodyPartsOrSuspense()}

            <h2>Exercises</h2>
            {exercisesOrSuspense()}

            <WorkoutView
                workout={selectedWorkout?.exercises || []}
                onRemoveExercise={removeExerciseACB}
            />
        </>
    );
});

export { Train };