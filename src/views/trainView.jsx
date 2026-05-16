import { BodyPartsView } from "./bodyPartsView";
import { ExercisesView } from "./exercisesView";
import { TemplatesView } from "./templatesView";
import { TemplateEditorView } from "./templateEditorView";
import { SessionLogView } from "./sessionLogView";
import { SuspenseView } from "./suspenseView";

function TrainView(props) {
    if (props.activeSession) {
        return (
            <SessionLogView
                session={props.activeSession}
                saveInProgress={props.sessionSaveInProgress}
                saveError={props.sessionSaveError}
                onUpdateSet={props.onUpdateActiveSet}
                onCancelSession={props.onCancelSession}
                onSaveSession={props.onSaveSession}
            />
        );
    }

    return (
        <>
            <input
                placeholder="New template name (e.g. Push)"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        props.onCreateTemplate(e.target.value);
                        e.target.value = "";
                    }
                }}
            />

            {props.templatesLoading ? (
                <p>Loading templates…</p>
            ) : (
                <TemplatesView
                    templates={props.templates}
                    selectedTemplateId={props.selectedTemplateId}
                    onSelectTemplate={props.onSelectTemplate}
                />
            )}

            <button onClick={props.onSearch}>Load body parts</button>

            <h2>Body Parts</h2>
            {props.searchData ? (
                <BodyPartsView
                    bodyParts={props.searchData}
                    onSelectBodyPart={props.onSelectBodyPart}
                />
            ) : (
                <SuspenseView
                    promise={props.searchPromise}
                    error={props.searchError}
                />
            )}

            <h2>Exercises</h2>
            {props.exercisesData ? (
                <ExercisesView
                    exercises={props.exercisesData}
                    onAddExercise={props.onAddExercise}
                />
            ) : (
                <div>Select a body part</div>
            )}

            <TemplateEditorView
                template={props.selectedTemplate}
                saveInProgress={props.templateSaveInProgress}
                saveError={props.templateSaveError}
                onSetExerciseSets={props.onSetExerciseSets}
                onRemoveExercise={props.onRemoveExercise}
                onSaveTemplate={props.onSaveTemplate}
                onStartSession={props.onStartSession}
                onRemoveTemplate={props.onRemoveTemplate}
            />
        </>
    );
}

export { TrainView };
