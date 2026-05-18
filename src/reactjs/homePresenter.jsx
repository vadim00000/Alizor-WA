import { observer } from "mobx-react-lite";
import HomeView from "../views/homeView";

export default observer(function HomePresenter(props) {
    const sessionsCount = props.model.getWeeklySessionCount();
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
            showHistory={props.model.showHistory}
            onToggleHistory={() => props.model.toggleShowHistory()}
            onSelectSession={onSelectSession}
            selectedSession={selectedSession}
            onCloseSelectedSession={() =>
                selectedSession && props.model.toggleSelectedHomeSessionId(selectedSession.id)
            }
        />
    );
});
