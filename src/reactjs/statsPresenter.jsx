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
    // Sessions may not have 'muscles' precomputed. Derive from exercises' bodyPart when needed.
    sessionsThisMonth.forEach(s => {
        const musclesInSession = new Set();
        if (Array.isArray(s.muscles) && s.muscles.length) {
            s.muscles.forEach(m => musclesInSession.add(m));
        } else if (Array.isArray(s.exercises)) {
            s.exercises.forEach(ex => {
                const bodyPart = String(ex.bodyPart || '').toLowerCase();
                if (bodyPart.includes('chest')) musclesInSession.add('Chest');
                if (bodyPart.includes('back')) musclesInSession.add('Back');
                if (bodyPart.includes('shoulder')) musclesInSession.add('Shoulders');
                // map upper/lower arms and arm-related parts to Arms
                if (bodyPart.includes('arm') || bodyPart.includes('upper arms') || bodyPart.includes('lower arms') || bodyPart.includes('biceps') || bodyPart.includes('triceps')) musclesInSession.add('Arms');
                if (bodyPart.includes('upper legs') || bodyPart.includes('lower legs') || bodyPart.includes('quads') || bodyPart.includes('hamstring') || bodyPart.includes('calf')) musclesInSession.add('Legs');
                if (bodyPart.includes('waist') || bodyPart.includes('core') || bodyPart.includes('abs')) musclesInSession.add('Waist');
                if (bodyPart.includes('glute') || bodyPart.includes('butt')) musclesInSession.add('Glutes');
                if (bodyPart.includes('neck')) musclesInSession.add('Neck');
                if (bodyPart.includes('cardio') || bodyPart.includes('run') || bodyPart.includes('bike') || bodyPart.includes('row')) musclesInSession.add('Cardio');
            });
        }
        musclesInSession.forEach(m => { if (counts[m] !== undefined) counts[m] += 1; });
    });
    return counts;
}

function buildTemplateStats(templates, sessions) {
    const countsByTemplateId = new Map();

    for (const t of templates) {
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
    // compute only with sessions whose template still exists (non-deleted)
    const templates = props.model.templates || [];
    const sessions = props.model.sessions || [];
    const existingTemplateIds = new Set(templates.map(t => String(t.id)));

    // If templates haven't loaded yet (empty) but sessions exist, don't filter to avoid transient zeros
    let sessionsNonDeleted;
    if (templates.length === 0 && sessions.length > 0) {
        sessionsNonDeleted = sessions;
    } else {
        sessionsNonDeleted = sessions.filter(s => existingTemplateIds.has(String(s.templateId)));
    }

    // (debug logs removed)

    const stats = buildTemplateStats(
        props.model.templates,
        sessionsNonDeleted
    );

    const totalSessions = sessionsNonDeleted.length;

    // Button contents computed here in presenter
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
    const prsText = `PRs: ${Array.isArray(props.model.prs) ? props.model.prs.length : 0} records`;

    // compute muscle counts for the same non-deleted session set
    const muscleCounts = computeMuscleCounts(sessionsNonDeleted);
    const muscleCountsAll = computeMuscleCounts(sessionsNonDeleted, { all: true });

    // Compute PRs: best (weight, then reps) per exercise name across sessions
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

    // build weightPoints from profileModel if provided
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

    // build per-exercise series: for each exercise name, collect points [{x:Date,y:weight}]
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

    return <StatsView stats={stats} totalSessions={totalSessions} overviewText={overviewText} muscleCounts={muscleCounts} prsText={prsTextUpdated} prs={prs} weightPoints={weightPoints} exerciseSeries={exerciseSeries} />;
});

export { StatsPresenter };
