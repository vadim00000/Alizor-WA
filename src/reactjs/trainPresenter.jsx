import { observer } from "mobx-react-lite";
import { TrainView } from "../views/trainView";

const Train = observer(function TrainRender(props) {
    const model = props.model;

    function searchACB() {
        model.doSearch();
    }

    function selectBodyPartACB(bodyPart) {
        model.setBodyPart(bodyPart);
    }

    function createTemplateACB(name) {
        model.createTemplate(name);
    }

    function selectTemplateACB(id) {
        model.selectTemplate(id);
    }

    function addExerciseACB(ex) {
        model.addExerciseToTemplate(ex);
    }

    function removeExerciseACB(ex) {
        model.removeExerciseFromTemplate(ex);
    }

    function setExerciseSetsACB(exerciseId, count) {
        model.setExerciseSetsCount(exerciseId, count);
    }

    function saveTemplateACB() {
        model.saveSelectedTemplate();
    }

    function removeTemplateACB() {
        model.removeSelectedTemplate();
    }

    function startSessionACB() {
        if (model.selectedTemplateId !== null) {
            model.startSession(model.selectedTemplateId);
        }
    }

    function updateActiveSetACB(exerciseId, setIndex, patch) {
        model.updateActiveSet(exerciseId, setIndex, patch);
    }

    function cancelSessionACB() {
        model.cancelActiveSession();
    }

    function saveSessionACB() {
        model.saveActiveSession();
    }

    const selectedTemplate = model.templates.find(
        (t) => t.id === model.selectedTemplateId
    );

    const loadTemplatesState = model.loadTemplatesPromiseState;
    const templatesLoading =
        !!loadTemplatesState.promise &&
        loadTemplatesState.data === null &&
        !loadTemplatesState.error;

    const saveTemplateState = model.saveTemplatePromiseState;
    const templateSaveInProgress =
        !!saveTemplateState.promise &&
        saveTemplateState.data === null &&
        !saveTemplateState.error;

    const saveSessionState = model.saveSessionPromiseState;
    const sessionSaveInProgress =
        !!saveSessionState.promise &&
        saveSessionState.data === null &&
        !saveSessionState.error;

    return (
        <TrainView
            templates={model.templates}
            selectedTemplateId={model.selectedTemplateId}
            selectedTemplate={selectedTemplate}
            templatesLoading={templatesLoading}
            templateSaveInProgress={templateSaveInProgress}
            templateSaveError={saveTemplateState.error}

            activeSession={model.activeSession}
            sessionSaveInProgress={sessionSaveInProgress}
            sessionSaveError={saveSessionState.error}

            searchData={model.searchResultsPromiseState.data}
            searchPromise={model.searchResultsPromiseState.promise}
            searchError={model.searchResultsPromiseState.error}

            exercisesData={model.exercisesPromiseState.data}
            exercisesPromise={model.exercisesPromiseState.promise}
            exercisesError={model.exercisesPromiseState.error}

            onSearch={searchACB}
            onSelectBodyPart={selectBodyPartACB}
            onCreateTemplate={createTemplateACB}
            onSelectTemplate={selectTemplateACB}
            onAddExercise={addExerciseACB}
            onRemoveExercise={removeExerciseACB}
            onSetExerciseSets={setExerciseSetsACB}
            onSaveTemplate={saveTemplateACB}
            onRemoveTemplate={removeTemplateACB}
            onStartSession={startSessionACB}
            onUpdateActiveSet={updateActiveSetACB}
            onCancelSession={cancelSessionACB}
            onSaveSession={saveSessionACB}
        />
    );
});

export { Train };
