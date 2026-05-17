import { BodyPartsView } from "./bodyPartsView";
import { ExercisesView } from "./exercisesView";
import { TemplatesView } from "./templatesView";
import { TemplateEditorView } from "./templateEditorView";
import { SessionLogView } from "./sessionLogView";
import { SuspenseView } from "./suspenseView";

function TrainView(props) {
    if (props.activeSession) {
        return (
            <div className="train-container train-session">
                <SessionLogView
                    session={props.activeSession}
                    saveInProgress={props.sessionSaveInProgress}
                    saveError={props.sessionSaveError}
                    onUpdateSet={props.onUpdateActiveSet}
                    onCancelSession={props.onCancelSession}
                    onSaveSession={props.onSaveSession}
                />
            </div>
        );
    }

    return (
        <div className="train-container">
            <div className="train-program train-card">
                <h2 className="train-section-title">Program</h2>

                <div className="train-workout-creator">
                    <p className="train-workout-creator-label">Add workout</p>
                    <input
                        className="train-input train-program-input"
                        placeholder="New workout name (e.g. Push)"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                props.onCreateTemplate(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />
                </div>

                {props.templatesLoading ? (
                    <p className="train-loading">Loading workouts…</p>
                ) : (
                    <div className="train-templates">
                        <TemplatesView
                            templates={props.templates}
                            selectedTemplateId={props.selectedTemplateId}
                            onSelectTemplate={props.onSelectTemplate}
                        />
                    </div>
                )}
            </div>

            <button className="train-button" onClick={props.onSearch}>Load body parts</button>

            <h2 className="train-section-title">Body Parts</h2>
            {props.searchData ? (
                <div className="train-body-parts train-card">
                    <BodyPartsView
                        bodyParts={props.searchData}
                        onSelectBodyPart={props.onSelectBodyPart}
                    />
                </div>
            ) : (
                <SuspenseView
                    promise={props.searchPromise}
                    error={props.searchError}
                />
            )}

            <h2 className="train-section-title">Exercises</h2>
            {props.exercisesData ? (
                <div className="train-exercises train-card">
                    <ExercisesView
                        exercises={props.exercisesData}
                        onAddExercise={props.onAddExercise}
                    />
                </div>
            ) : (
                <div className="train-empty-state">Select a body part</div>
            )}

            <div className="train-editor train-card">
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
            </div>
        </div>
    );
}

export { TrainView };
