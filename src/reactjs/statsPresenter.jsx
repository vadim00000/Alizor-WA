import { observer } from "mobx-react-lite";
import StatsView from "../views/statsView";

const DEFAULT_MUSCLES = ['Chest','Back','Shoulders','Arms','Legs','Core','Glutes','Waist','Neck','Cardio'];

function computeMuscleCounts(sessions = [], options = { all: false }) {  
    const now = new Date();
    const sessionsThisMonth = options.all ? sessions : sessions.filter(s => {
        const d = new Date(s.performedAt || s.date || Date.now());
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const counts = {};
    DEFAULT_MUSCLES.forEach(m => counts[m] = 0);
    sessionsThisMonth.forEach(s => {
        const musclesInSession = new Set();
        if (Array.isArray(s.muscles) && s.muscles.length) {
            s.muscles.forEach(m => musclesInSession.add(m));
        } else if (Array.isArray(s.exercises)) {
            s.exercises.forEach(ex => {
                const bodyPart = String(ex.bodyPart || '').toLowerCase();

                const MUSCLE_KEYWORDS = {
                    Chest: ['chest', 'pectoral', 'pec'],
                    Back: ['back', 'lats', 'latissimus', 'trap', 'trapezius'],
                    Shoulders: ['shoulder', 'deltoid', 'delts'],
                    Arms: ['arm', 'biceps', 'triceps', 'forearm', 'upper arm', 'lower arm'],
                    Legs: ['upper leg', 'lower leg', 'quad', 'quads', 'hamstring', 'calf', 'thigh'],
                    Waist: ['waist', 'core', 'abs', 'abdominal', 'ab'],
                    Glutes: ['glute', 'butt', 'gluteus'],
                    Neck: ['neck'],
                    Cardio: ['cardio', 'run', 'bike', 'row', 'treadmill', 'elliptical']
                };

                for (const [muscle, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
                    for (const kw of keywords) {
                        if (bodyPart.includes(kw)) {
                            musclesInSession.add(muscle);
                            break; 
                        }
                    }
                }
            });
        }
        musclesInSession.forEach(m => { if (counts[m] !== undefined) counts[m] += 1; });
    });
    return counts;
}

function buildTemplateStats(templates, sessions) {
    let templateList = [];
    if (Array.isArray(templates)) {
        templateList = templates;
    } else if (templates && typeof templates[Symbol.iterator] === 'function') {
        templateList = Array.from(templates);
    } else if (templates && typeof templates === 'object') {
        templateList = Object.values(templates);
    } else {
        templateList = [];
    }

    const countsByTemplateId = new Map();

    for (const t of templateList) {
        countsByTemplateId.set(t.id, {
            templateId: t.id,
            templateName: t.name,
            count: 0,
            exists: true,
        });
    }

    for (const s of sessions) {
        const existing = countsByTemplateId.get(s.templateId);
        if (existing) {
            existing.count += 1;
        } else {
            countsByTemplateId.set(s.templateId, {
                templateId: s.templateId,
                templateName: s.templateName,
                count: 1,
                exists: false,
            });
        }
    }

    return Array.from(countsByTemplateId.values()).sort(
        (a, b) => b.count - a.count
    );
}

const StatsPresenter = observer(function StatsPresenter(props) {
    const trainModel = props.trainModel || {};
    const statsModel = props.statsModel || {};

    const templates = Array.isArray(trainModel.templates) ? trainModel.templates : [];
    const sessions = Array.isArray(trainModel.sessions) ? trainModel.sessions : [];
    const existingTemplateIds = new Set(templates.map(t => String(t.id)));

    let sessionsNonDeleted;
    if (templates.length === 0 && sessions.length > 0) {
        sessionsNonDeleted = sessions;
    } else {
        sessionsNonDeleted = sessions.filter(s => existingTemplateIds.has(String(s.templateId)));
    }

    const stats = buildTemplateStats(
        templates,
        sessionsNonDeleted
    );

    const totalSessions = sessionsNonDeleted.length;

    const totalVolume = sessionsNonDeleted.reduce((acc, s) => {
        if (typeof s.volume === 'number') return acc + s.volume;
        if (Array.isArray(s.exercises)) {
            const sessionVol = s.exercises.reduce((seAcc, e) => {
                if (!Array.isArray(e.sets)) return seAcc;
                return seAcc + e.sets.reduce((setAcc, set) => {
                    const reps = Number(set.reps || 0);
                    const weight = Number(set.weight || 0);
                    return setAcc + (reps * weight);
                }, 0);
            }, 0);
            return acc + sessionVol;
        }
        return acc;
    }, 0);

    const overviewText = `Overview: ${totalSessions} sessions, total volume ${totalVolume}`;
    const prsText = `PRs: ${Array.isArray(statsModel.prs) ? statsModel.prs.length : 0} records`;

    const muscleCounts = computeMuscleCounts(sessionsNonDeleted);
    const muscleCountsAll = computeMuscleCounts(sessionsNonDeleted, { all: true });

    const prsMap = new Map();
    sessionsNonDeleted.forEach(s => {
        if (!Array.isArray(s.exercises)) return;
        s.exercises.forEach(ex => {
            const exName = ex.name || ex.id || '<unknown>';
            if (!Array.isArray(ex.sets)) return;
            ex.sets.forEach(set => {
                const weight = Number(set.weight || 0);
                const reps = Number(set.reps || 0);
                const current = prsMap.get(exName);
                if (!current) {
                    prsMap.set(exName, { name: exName, weight, reps });
                } else {
                    if (weight > current.weight) {
                        prsMap.set(exName, { name: exName, weight, reps });
                    } else if (weight === current.weight && reps > current.reps) {
                        prsMap.set(exName, { name: exName, weight, reps });
                    }
                }
            });
        });
    });

    const prs = Array.from(prsMap.values()).sort((a, b) => b.weight - a.weight || b.reps - a.reps);
    const prsTextUpdated = `PRs: ${prs.length} exercises`;

    const profileModel = props.profileModel;
    let weightPoints = [];
    try {
        if (profileModel && Array.isArray(profileModel.weightHistory)) {
            weightPoints = profileModel.weightHistory.map(p => {
                const tsNum = Number(p.ts);
                const t = new Date(Number.isFinite(tsNum) ? tsNum : Date.now());
                return { x: t, y: Number(p.weightKg) };
            }).sort((a,b) => a.x - b.x);
        }
    } catch (e) { weightPoints = []; }
   
    const exerciseMap = new Map();
    try {
        sessionsNonDeleted.forEach(s => {
            const d = new Date(s.performedAt || s.date || Date.now());
            if (!Array.isArray(s.exercises)) return;
            s.exercises.forEach(ex => {
                const exName = ex.name || ex.id || '<unknown>';
                if (!Array.isArray(ex.sets) || ex.sets.length === 0) return;
                // choose the heaviest set weight as the session value for this exercise
                const maxWeight = ex.sets.reduce((m, st) => {
                    const w = Number(st.weight || 0);
                    return w > m ? w : m;
                }, 0);
                if (maxWeight <= 0) return;
                const arr = exerciseMap.get(exName) || [];
                arr.push({ x: d, y: maxWeight });
                exerciseMap.set(exName, arr);
            });
        });
    } catch (e) { /* ignore */ }

    // sort each series by date
    const exerciseSeries = {};
    exerciseMap.forEach((arr, name) => {
        exerciseSeries[name] = arr.sort((a,b) => a.x - b.x);
    });

    return <StatsView
        stats={stats}
        totalSessions={totalSessions}
        overviewText={overviewText}
        muscleCounts={muscleCounts}
        prsText={prsTextUpdated}
        prs={prs}
        weightPoints={weightPoints}
        exerciseSeries={exerciseSeries}
        // UI state from statsModel
        activeTab={statsModel.uiActiveTab}
        selectedExercise={statsModel.uiSelectedExercise}
        selectedExerciseSeries={statsModel.uiSelectedExerciseSeries}
        // callbacks to update statsModel UI state
        onActiveTabChange={(tab) => statsModel.setUiActiveTab && statsModel.setUiActiveTab(tab)}
        onSelectedExerciseChange={(ex) => statsModel.setUiSelectedExercise && statsModel.setUiSelectedExercise(ex)}
        onSelectedExerciseSeriesChange={(s) => statsModel.setUiSelectedExerciseSeries && statsModel.setUiSelectedExerciseSeries(s)}
    />;
});

export { StatsPresenter };
