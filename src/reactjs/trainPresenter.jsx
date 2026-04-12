import { observer } from "mobx-react-lite";
import { BodyPartsView } from "../views/bodyPartsView";
import { ExercisesView } from "../views/exercisesView";
import { WorkoutView } from "../views/workoutView";
import { SuspenseView } from "../views/suspenseView";

const Train = observer(function TrainRender(props){

    function searchACB(){
        props.model.doSearch();
    }

    function selectBodyPartACB(bodyPart){
        props.model.setBodyPart(bodyPart);
    }

    function addExerciseACB(ex){
        props.model.addToWorkout({
            ...ex,
            sets: 3,
            reps: 8
        });
    }

    function removeExerciseACB(ex){
        props.model.removeFromWorkout(ex);
    }

    function bodyPartsOrSuspense(){
        const state = props.model.searchResultsPromiseState;

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
        const state = props.model.exercisesPromiseState;

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
            <button onClick={searchACB}>
                Load body parts
            </button>

            <h2>Body Parts</h2>
            {bodyPartsOrSuspense()}

            <h2>Exercises</h2>
            {exercisesOrSuspense()}

            <WorkoutView
                workout={props.model.exercises}
                onRemoveExercise={removeExerciseACB}
            />
        </>
    );
});

export { Train };