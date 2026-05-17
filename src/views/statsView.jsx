import WeightChart from './WeightChart';
import '../css/stats.css';

export default function StatsView(props) {
    // Fully prop-driven: component reads values from props (with sensible defaults)
    // and invokes callbacks to request changes. No internal useState is used here.
    const active = props.activeTab ?? 'overview';
    const selectedExercise = props.selectedExercise ?? null;
    const selectedExerciseSeries = props.selectedExerciseSeries ?? [];

    const setActive = (v) => { if (typeof props.onActiveTabChange === 'function') props.onActiveTabChange(v); };
    const setSelectedExercise = (v) => { if (typeof props.onSelectedExerciseChange === 'function') props.onSelectedExerciseChange(v); };
    const setSelectedExerciseSeries = (v) => { if (typeof props.onSelectedExerciseSeriesChange === 'function') props.onSelectedExerciseSeriesChange(v); };

    const renderOverview = () => {
        const stats = props.stats || [];
        return (
            <div>
                <p>{props.overviewText}</p>
                <ul>
                    {stats.map(s => (
                        <li key={String(s.templateId)}>{s.templateName || 'Unknown'}{!s.exists ? ' (deleted)' : ''}: {s.count} {s.count === 1 ? 'session' : 'sessions'}</li>
                    ))}
                </ul>

                {Array.isArray(props.weightPoints) && props.weightPoints.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ margin: '0 0 0.25rem 0' }}>Weight history</h3>
                        <WeightChart points={props.weightPoints} height={260} />
                    </div>
                )}
            </div>
        );
    };

    const renderMuscles = () => {
        const mc = props.muscleCounts || {};
        const entries = Object.entries(mc)
            .filter(([, v]) => Number(v) > 0)
            .sort((a, b) => b[1] - a[1]);
        return (
            <ul>
                {entries.map(([k, v]) => <li key={k}>{k}: {v}</li>)}
                {entries.length === 0 && <li>No muscles worked</li>}
            </ul>
        );
    };

    const renderPRs = () => {
        const prs = props.prs || [];
        if (!prs.length) return <p>{props.prsText || 'No PRs yet'}</p>;

        // Group PRs by exercise name (if prs is an array of { name, weight, reps })
        const byExercise = prs.reduce((acc, p) => {
            const key = p.name || 'Unknown';
            acc[key] = acc[key] || [];
            acc[key].push(p);
            return acc;
        }, {});

        const exercises = Object.keys(byExercise).sort();

        return (
            <div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {exercises.map((ex) => (
                        <button key={ex} onClick={() => setSelectedExercise(ex)} className={`pr-ex-btn ${selectedExercise === ex ? 'active' : ''}`}>
                            {ex}
                        </button>
                    ))}
                    {exercises.length === 0 && <span>No PR exercises</span>}
                </div>

                {selectedExercise ? (
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedExercise} — PRs</h4>
                        <ul>
                            {byExercise[selectedExercise].map((p, i) => (
                                <li key={i}>{p.name}: {p.weight} x {p.reps}</li>
                            ))}
                        </ul>
                        <button onClick={() => setSelectedExercise(null)} style={{ marginTop: '0.5rem' }}>Back</button>
                    </div>
                ) : (
                    <p style={{ color: '#666' }}>Clique sur un exercice pour voir ses PRs</p>
                )}
            </div>
        );
    };

    return (
        <div className="stats-container">
            <h1>Stats</h1>
            <p style={{ marginTop: 8 }}>Total sessions logged: {props.totalSessions}</p>

            <div className="stats-actions">
                <button className={`tab-btn overview ${active === 'overview' ? 'active' : ''}`} onClick={() => setActive('overview')}>Overview</button>
                <button className={`tab-btn details ${active === 'details' ? 'active' : ''}`} onClick={() => {
                    setActive('details');
                    // auto-select first exercise if available
                    const exKeys = Object.keys(props.exerciseSeries || {});
                    if (exKeys.length > 0) {
                        setSelectedExercise(exKeys[0]);
                        setSelectedExerciseSeries(props.exerciseSeries[exKeys[0]] || []);
                    } else {
                        setSelectedExercise(null);
                        setSelectedExerciseSeries([]);
                    }
                }}>Details</button>
                <button className={`tab-btn muscles ${active === 'muscles' ? 'active' : ''}`} onClick={() => setActive('muscles')}>Muscles</button>
                <button className={`tab-btn prs ${active === 'prs' ? 'active' : ''}`} onClick={() => setActive('prs')}>PRs</button>
            </div>

            <div className="action-panel">
                {active === 'overview' && renderOverview()}
                {active === 'details' && (
                    <div>
                        <h3 style={{ marginTop: 0 }}>Exercise Details</h3>
                        {renderDetailsForExercises(props.exerciseSeries, (ex) => {
                            setSelectedExercise(ex);
                            setSelectedExerciseSeries(props.exerciseSeries[ex] || []);
                        }, setSelectedExerciseSeries)}

                        {selectedExercise && (
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedExercise}</h4>
                                {Array.isArray(selectedExerciseSeries) && selectedExerciseSeries.length > 0 ? (
                                    <div className="chart-wrapper"><WeightChart points={selectedExerciseSeries} height={260} /></div>
                                ) : (
                                    <p className="stats-empty">No data for this exercise yet.</p>
                                )}
                                <div style={{ marginTop: '0.5rem' }}>
                                    <button onClick={() => { setSelectedExercise(null); setSelectedExerciseSeries([]); }}>Back</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {active === 'muscles' && renderMuscles()}
                {active === 'prs' && renderPRs()}
            </div>
        </div>
    );
}

function renderDetailsForExercises(exerciseSeries, setSelectedExercise, setSelectedExerciseSeries) {
    const exercises = Object.keys(exerciseSeries || {}).sort();
    if (exercises.length === 0) return <p>No exercise data available</p>;

    return (
        <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {exercises.map(ex => (
                    <button key={ex} onClick={() => { setSelectedExercise(ex); setSelectedExerciseSeries(exerciseSeries[ex] || []); }} className="pr-ex-btn">
                        {ex}
                    </button>
                ))}
            </div>
            <div>
                <p style={{ color: '#666' }}>Click on an exercise to see its weight progression over time.</p>
            </div>
        </div>
    );
}


