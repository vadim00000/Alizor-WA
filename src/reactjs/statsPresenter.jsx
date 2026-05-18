import { observer } from "mobx-react-lite";
import StatsView from "../views/statsView";

const StatsPresenter = observer(function StatsPresenter(props) {
    const trainModel = props.trainModel || {};
    const profileModel = props.profileModel || {};
    const statsModel = props.statsModel || {};

    const viewData = typeof statsModel.getViewData === "function"
        ? statsModel.getViewData(trainModel, profileModel)
        : {
            stats: [],
            totalSessions: 0,
            totalVolume: 0,
            summaryCards: [],
            overviewText: "Overview: 0 sessions, total volume 0",
            prsText: "PRs: 0 exercises",
            muscleCounts: {},
            muscleEntries: [],
            prs: [],
            prsByExercise: {},
            exerciseNames: [],
            prExerciseNames: [],
            weightPoints: [],
            exerciseSeries: {},
        };

    const activeTab = statsModel.uiActiveTab ?? "overview";
    const selectedExercise = (() => {
        const current = statsModel.uiSelectedExercise;
        const isCurrentValid = Boolean(current) && (
            viewData.exerciseNames.includes(current) ||
            viewData.prExerciseNames.includes(current)
        );

        if (isCurrentValid) return current;
        return viewData.exerciseNames[0] || viewData.prExerciseNames[0] || null;
    })();
    const selectedExerciseSeries = selectedExercise && viewData.exerciseSeries[selectedExercise]
        ? viewData.exerciseSeries[selectedExercise]
        : [];
    const selectedPrs = selectedExercise && viewData.prsByExercise[selectedExercise]
        ? viewData.prsByExercise[selectedExercise]
        : [];

    return (
        <StatsView
            summaryCards={viewData.summaryCards}
            totalSessions={viewData.totalSessions}
            overviewText={viewData.overviewText}
            stats={viewData.stats}
            muscleEntries={viewData.muscleEntries}
            prsText={viewData.prsText}
            exerciseNames={viewData.exerciseNames}
            prExerciseNames={viewData.prExerciseNames}
            weightPoints={viewData.weightPoints}
            activeTab={activeTab}
            selectedExercise={selectedExercise}
            selectedExerciseSeries={selectedExerciseSeries}
            selectedPrs={selectedPrs}
            onActiveTabChange={(tab) => statsModel.setUiActiveTab && statsModel.setUiActiveTab(tab)}
            onSelectedExerciseChange={(exercise) => statsModel.setUiSelectedExercise && statsModel.setUiSelectedExercise(exercise)}
        />
    );
});

export { StatsPresenter };