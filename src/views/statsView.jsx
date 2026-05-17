import { useState } from 'react';
import WeightChart from './WeightChart';

export default function StatsView(props) {
    const [active, setActive] = useState('overview');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [selectedExerciseSeries, setSelectedExerciseSeries] = useState([]);

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
                        {/* Inline SVG WeightGraph is still available below as WeightGraph (fallback) */}
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
        <div>
            <h1>Stats</h1>
            <p>Total sessions logged: {props.totalSessions}</p>

            <div className="stats-actions">
                <button className={`tab-btn overview ${active === 'overview' ? 'active' : ''}`} onClick={() => setActive('overview')}>Overview</button>
                <button className={`tab-btn details ${active === 'details' ? 'active' : ''}`} onClick={() => { setActive('details'); setSelectedExercise(null); }}>Details</button>
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
                                    <WeightChart points={selectedExerciseSeries} height={260} />
                                ) : (
                                    <p style={{ color: '#666' }}>No data for this exercise yet.</p>
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
                <p style={{ color: '#666' }}>Clique sur un exercice pour afficher son graphe</p>
            </div>
        </div>
    );
}

function renderDetails() {
    // `props` is not available here, so this function will be bound from inside the component where needed.
    return null;
}

function WeightGraph({ points, width = 720, height = 220 }) {
    const pad = 10;
  const innerW = Math.max(10, width - pad * 2);
  const innerH = Math.max(10, height - pad * 2);
    const xs = points.map(p => p.x.getTime());
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    // fixed y domain 0..150 as requested
    const minY = 0;
    const maxY = 150;

  const xScale = (t) => {
    if (minX === maxX) return pad + innerW / 2;
    return pad + ((t - minX) / (maxX - minX)) * innerW;
  };
  const yScale = (v) => {
        // clamp value into domain then scale
        const vv = Math.max(minY, Math.min(maxY, v));
        return pad + innerH - ((vv - minY) / (maxY - minY)) * innerH;
  };

  const pathD = points.map((p, i) => {
    const x = xScale(p.x.getTime());
    const y = yScale(p.y);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid #eee', background: '#fff' }}>
            <rect x={0} y={0} width={width} height={height} fill="#fff" />
            {/* subtle shadow stroke for depth */}
            <path d={pathD} fill="none" stroke="rgba(25,118,210,0.12)" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
            <path d={pathD} fill="none" stroke="#1976d2" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
                <g key={i}>
                                        {/* point shadow */}
                                        <circle cx={xScale(p.x.getTime())} cy={yScale(p.y)} r={6} fill="rgba(0,0,0,0.06)" />
                                        <circle cx={xScale(p.x.getTime())} cy={yScale(p.y)} r={5} fill="#1976d2" stroke="#fff" strokeWidth={0.8} />
                                        {/* value label just above the point */}
                                        <text x={xScale(p.x.getTime())} y={Math.max(10, yScale(p.y) - 12)} fontSize={12} fill="#222" fontWeight={700} textAnchor="middle">{Number(p.y).toFixed(1)} kg</text>
                                        {/* x-axis label: show only the date (day/month) */}
                                        <text x={xScale(p.x.getTime())} y={height - 8} fontSize={11} fill="#666" textAnchor="middle">{formatDateLabel(p.x)}</text>
                </g>
            ))}
            {/* y-axis labels fixed at 0 and 150 */}
                        <text x={8} y={pad + 14} fontSize={12} fill="#666">150 kg</text>
                        <text x={8} y={height - 8} fontSize={12} fill="#666">0 kg</text>
    </svg>
  );
}

function formatDateLabel(d) {
    if (!(d instanceof Date)) d = new Date(d);
    const pad2 = (n) => String(n).padStart(2, '0');
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
}
