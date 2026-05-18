import WeightChart from './WeightChart';
import '../css/stats.css';

function StatCard({ label, value, unit }) {
    return (
        <article className="stats-summary-card">
            <p className="stats-summary-label">{label}</p>
            <p className="stats-summary-number">{value}</p>
            {unit ? <p className="stats-summary-unit">{unit}</p> : null}
        </article>
    );
}

function SectionTitle({ kicker, title, subtitle }) {
    return (
        <div className="stats-section-head">
            <div>
                {kicker ? <p className="stats-kicker">{kicker}</p> : null}
                <h2 className="stats-section-title">{title}</h2>
            </div>
            {subtitle ? <p className="stats-section-subtitle">{subtitle}</p> : null}
        </div>
    );
}

export default function StatsView(props) {
    const active = props.activeTab ?? 'overview';
    const summaryCards = Array.isArray(props.summaryCards) ? props.summaryCards : [];
    const stats = Array.isArray(props.stats) ? props.stats : [];
    const muscleEntries = Array.isArray(props.muscleEntries) ? props.muscleEntries : [];
    const exerciseNames = Array.isArray(props.exerciseNames) ? props.exerciseNames : [];
    const prExerciseNames = Array.isArray(props.prExerciseNames) ? props.prExerciseNames : [];
    const selectedExercise = props.selectedExercise ?? null;
    const selectedExerciseSeries = Array.isArray(props.selectedExerciseSeries) ? props.selectedExerciseSeries : [];
    const selectedPrs = Array.isArray(props.selectedPrs) ? props.selectedPrs : [];

    return (
        <div className="stats-container">
            <div className="stats-hero">
                <div>
                    <p className="stats-kicker">Training analytics</p>
                    <h1 className="stats-title">Stats</h1>
                </div>
            </div>

            <div className="stats-summary-grid">
                {summaryCards.map((card) => (
                    <StatCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        unit={card.unit}
                    />
                ))}
            </div>

            <div className="stats-tabs">
                <button className={`tab-btn ${active === 'overview' ? 'active' : ''}`} onClick={() => props.onActiveTabChange('overview')}>Overview</button>
                <button className={`tab-btn ${active === 'details' ? 'active' : ''}`} onClick={() => props.onActiveTabChange('details')}>Details</button>
                <button className={`tab-btn ${active === 'muscles' ? 'active' : ''}`} onClick={() => props.onActiveTabChange('muscles')}>Muscles</button>
                <button className={`tab-btn ${active === 'prs' ? 'active' : ''}`} onClick={() => props.onActiveTabChange('prs')}>PRs</button>
            </div>

            <section className="stats-panel">
                {active === 'overview' && (
                    <div className="stats-stack">
                        <SectionTitle kicker="Overview" title="Workout distribution" subtitle={props.overviewText} />

                        <div className="stats-card stats-card-tight">
                            <ul className="stats-session-list">
                                {stats.length === 0 ? (
                                    <li className="stats-empty">No sessions available yet.</li>
                                ) : (
                                    stats.map((sessionStat) => (
                                        <li key={String(sessionStat.templateId)} className="stats-session-row">
                                            <span className="stats-session-name">
                                                {sessionStat.templateName || 'Unknown'}
                                                {!sessionStat.exists ? ' (deleted)' : ''}
                                            </span>
                                            <span className="stats-session-count">
                                                {sessionStat.count} {sessionStat.count === 1 ? 'session' : 'sessions'}
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {Array.isArray(props.weightPoints) && props.weightPoints.length > 0 && (
                            <div className="stats-chart-card">
                                <SectionTitle kicker="Progress" title="Weight history" subtitle="Body weight trend over time." />
                                <WeightChart points={props.weightPoints} height={260} />
                            </div>
                        )}
                    </div>
                )}

                {active === 'details' && (
                    <div className="stats-stack">
                        <SectionTitle kicker="Details" title="Exercise progression" subtitle="Pick an exercise to view its heaviest set over time." />

                        <div className="stats-chip-row">
                            {exerciseNames.length === 0 ? (
                                <p className="stats-empty">No exercise data available.</p>
                            ) : (
                                exerciseNames.map((exerciseName) => (
                                    <button
                                        key={exerciseName}
                                        type="button"
                                        className={`stats-chip ${selectedExercise === exerciseName ? 'active' : ''}`}
                                        onClick={() => props.onSelectedExerciseChange(exerciseName)}
                                    >
                                        {exerciseName}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="stats-card">
                            {selectedExercise ? (
                                selectedExerciseSeries.length > 0 ? (
                                    <div className="stats-chart-card-inner">
                                        <h3 className="stats-card-title">{selectedExercise}</h3>
                                        <WeightChart points={selectedExerciseSeries} height={260} />
                                    </div>
                                ) : (
                                    <p className="stats-empty">No data for this exercise yet.</p>
                                )
                            ) : (
                                <p className="stats-empty">Select an exercise to display its progression.</p>
                            )}
                        </div>
                    </div>
                )}

                {active === 'muscles' && (
                    <div className="stats-stack">
                        <SectionTitle kicker="Muscles" title="Monthly muscle balance" subtitle="High-level groups derived from your training sessions." />

                        {muscleEntries.length === 0 ? (
                            <div className="stats-card">
                                <p className="stats-empty">No muscles worked yet.</p>
                            </div>
                        ) : (
                            <div className="stats-chip-grid">
                                {muscleEntries.map(([muscle, count]) => (
                                    <article key={muscle} className="stats-chip-card">
                                        <span className="stats-chip-name">{muscle}</span>
                                        <span className="stats-chip-count">{count}</span>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {active === 'prs' && (
                    <div className="stats-stack">
                        <SectionTitle kicker="PRs" title="Personal records" subtitle={props.prsText || 'No PRs yet.'} />

                        <div className="stats-chip-row">
                            {prExerciseNames.length === 0 ? (
                                <p className="stats-empty">No PR exercises available.</p>
                            ) : (
                                prExerciseNames.map((exerciseName) => (
                                    <button
                                        key={exerciseName}
                                        type="button"
                                        className={`stats-chip ${selectedExercise === exerciseName ? 'active' : ''}`}
                                        onClick={() => props.onSelectedExerciseChange(exerciseName)}
                                    >
                                        {exerciseName}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="stats-card">
                            {selectedExercise ? (
                                selectedPrs.length > 0 ? (
                                    <ul className="stats-pr-list">
                                        {selectedPrs.map((pr, index) => (
                                            <li key={`${pr.name}-${index}`} className="stats-pr-row">
                                                <span className="stats-pr-main">{pr.name}</span>
                                                <span className="stats-pr-value">{pr.weight} kg × {pr.reps} reps</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="stats-empty">No PR data for this exercise yet.</p>
                                )
                            ) : (
                                <p className="stats-empty">Select an exercise to see its PRs.</p>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}