import { searchExercises } from "./exerciseSource";
import { resolvePromise } from "./resolvePromise";
import { getExercisesByBodyPart } from "./exerciseSource";

export const model = {
    exercises: [],
    selectedBodyPart: null,
    searchResultsPromiseState: {},
    exercisesPromiseState: {},

    addToWorkout(exercise){
        this.exercises = [...this.exercises, exercise];
    },

    removeFromWorkout(exercise){
        this.exercises = this.exercises.filter(e => e.id !== exercise.id);
    },

    doSearch(){
        resolvePromise(
            searchExercises(),
            this.searchResultsPromiseState
        );
    },

    setBodyPart(bodyPart){
    this.selectedBodyPart = bodyPart;

    resolvePromise(
        getExercisesByBodyPart(bodyPart),
        this.exercisesPromiseState
    );
}
};