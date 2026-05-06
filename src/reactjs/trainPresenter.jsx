import { observer } from "mobx-react-lite";
import { TrainView } from "../views/trainView";

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

    function updateSetACB(ex, setIndex, patch) {
        model.updateSet(ex, setIndex, patch);
    }

    function addSetACB(ex) {
        model.addSet(ex);
    }

    function removeSetACB(ex, setIndex) {
        model.removeSet(ex, setIndex);
    }

    function createWorkoutACB(name){
        model.createWorkout(name);
    }

    function selectWorkoutACB(id){
        model.selectWorkout(id);
    }

    function saveWorkoutACB() {
        model.saveSelectedWorkout();
    }

    function removeWorkoutACB() {
        model.removeSelectedWorkout();
    }

    const selectedWorkout = model.workouts.find(
        w => w.id === model.selectedWorkoutId
    );

    const loadState = model.loadWorkoutsPromiseState;
    const workoutsLoading =
        !!loadState.promise &&
        loadState.data === null &&
        !loadState.error;

    const saveState = model.saveWorkoutPromiseState;
    const saveInProgress =
        !!saveState.promise &&
        saveState.data === null &&
        !saveState.error;

    return (
        <TrainView
            workouts={model.workouts}
            selectedWorkoutId={model.selectedWorkoutId}
            selectedWorkout={selectedWorkout}
            
            workoutsLoading={workoutsLoading}
            saveInProgress={saveInProgress}
            saveWorkoutError={model.saveWorkoutPromiseState.error}
            searchData={model.searchResultsPromiseState.data}
            searchPromise={model.searchResultsPromiseState.promise}
            searchError={model.searchResultsPromiseState.error}

            exercisesData={model.exercisesPromiseState.data}
            exercisesPromise={model.exercisesPromiseState.promise}
            exercisesError={model.exercisesPromiseState.error}
            
            onSearch={searchACB}
            onSelectBodyPart={selectBodyPartACB}
            onAddExercise={addExerciseACB}
            onRemoveExercise={removeExerciseACB}
            onUpdateSet={updateSetACB}
            onAddSet={addSetACB}
            onRemoveSet={removeSetACB}
            onCreateWorkout={createWorkoutACB}
            onSelectWorkout={selectWorkoutACB}
            onSaveWorkout={saveWorkoutACB}
            onRemoveWorkout={removeWorkoutACB}
        />
    );
});

export { Train };