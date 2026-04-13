

export function getWeeklyStats(workoutHistory) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentWorkouts = workoutHistory.filter(session => {
            return new Date(session.date) >= oneWeekAgo;
        });

        const workoutsCount = recentWorkouts.length;

        return workoutsCount;
    }