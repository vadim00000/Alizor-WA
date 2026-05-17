export function getWeeklySessionCount(sessions = []) {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recent = sessions.filter((session) => {
        const timestamp = Number(session.performedAt);

        return Number.isFinite(timestamp) && timestamp >= oneWeekAgo;
    });

    return recent.length;
}
