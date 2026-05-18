import { observer } from "mobx-react-lite";
import { useState } from "react";
import HomeView from "../views/homeView";
import { getWeeklySessionCount } from "../utilities";

export default observer(function HomePresenter(props) {
    const sessionsCount = getWeeklySessionCount(props.model.sessions);
    const [isOpen, setIsOpen] = useState(false);
    const recentSessions = props.model.getWeekSessions();

    function onSelectSession(sessionId) {
        props.model.toggleSelectedHomeSessionId(sessionId);
    }

    const selectedSession = recentSessions.find(
        (session) => session.id === props.model.selectedHomeSessionId
    );

    return (
        <HomeView
            sessionsCount={sessionsCount}
            recentSessions={recentSessions}
            showHistory={isOpen}
            onToggleHistory={() => setIsOpen(!isOpen)}
            onSelectSession={onSelectSession}
            selectedSession={selectedSession}
            onCloseSelectedSession={() =>
                selectedSession && props.model.toggleSelectedHomeSessionId(selectedSession.id)
            }
        />
    );
});
