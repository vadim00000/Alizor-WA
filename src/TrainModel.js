import { searchExercises } from "./exerciseSource";
import { resolvePromise } from "./resolvePromise";
import { getExercisesByBodyPart } from "./exerciseSource";

export const model = {
    workouts: [],
    selectedWorkoutId: null,

    selectedBodyPart: null,
    searchResultsPromiseState: {},
    exercisesPromiseState: {},

    createWorkout(name){
        if(!name.trim()) return;

        const newWorkout = {
            id: Date.now(),
            name,
            exercises: []
        };

        this.workouts = [...this.workouts, newWorkout];
    },

    selectWorkout(id){
        this.selectedWorkoutId = id;
    },

    addToWorkout(exercise){
        if(this.selectedWorkoutId === null) return;

        this.workouts = this.workouts.map(w => {
            if(w.id === this.selectedWorkoutId){

                if(w.exercises.find(e => e.id === exercise.id)){
                    return w;
                }

                return {
                    ...w,
                    exercises: [
                        ...w.exercises,
                        { ...exercise, sets: 3, reps: 8 }
                    ]
                };
            }
            return w;
        });
    },

    removeFromWorkout(exercise){
        this.workouts = this.workouts.map(w => {
            if(w.id === this.selectedWorkoutId){
                return {
                    ...w,
                    exercises: w.exercises.filter(e => e.id !== exercise.id)
                };
            }
            return w;
        });
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