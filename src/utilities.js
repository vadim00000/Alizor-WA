export function getWeeklyStats(workouts = []) {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentWorkouts = workouts.filter((session) => {
        const timestamp = Number(session.createdAt);

        return Number.isFinite(timestamp) && timestamp >= oneWeekAgo;
    });

    return recentWorkouts.length;
}