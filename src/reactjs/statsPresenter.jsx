import { observer } from "mobx-react-lite";
import StatsView from "../views/statsView";

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
    const stats = buildTemplateStats(
        props.model.templates,
        props.model.sessions
    );

    const totalSessions = props.model.sessions.length;

    return <StatsView stats={stats} totalSessions={totalSessions} />;
});

export { StatsPresenter };
