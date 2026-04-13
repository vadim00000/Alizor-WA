//import { searchExercises } from "./exerciseSource";
//import { resolvePromise } from "./resolvePromise";
//import { getExercisesByBodyPart } from "./exerciseSource";

export const model = {
    workouts: [
        {id: 1, name: "push", exercices: []},
        {id: 2, name: "pull", exercices: []},
        {id: 1, name: "legs", exercices: []}
    ],
    selectedWorkoutId: null,
    workoutHistory: [
        { id: 101, workoutId: 1, duration: 55, date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
        { id: 102, workoutId: 2, duration: 65, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
        { id: 103, workoutId: 1, duration: 50, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
        { id: 104, workoutId: 2, duration: 70, date: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString() },
        { id: 105, workoutId: 1, duration: 45, date: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString() },
    ],

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

    saveCompletedWorkout(workoutId, durationInMinutes) {
        const completedSession = {
            id: Date.now(),
            workoutId: workoutId,
            duration: durationInMinutes,
            date: new Date().toISOString()
        };

        this.workoutHistory = [...this.workoutHistory, completedSession];
    },

    getWeekWorkouts() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return this.workoutHistory
            .filter(session => new Date(session.date) >= oneWeekAgo)
    },

    selectWorkout(id){
        this.selectedWorkoutId = id;
    },

    getWorkout(id) {
        return this.workouts.find((workout) => workout.id === id);
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