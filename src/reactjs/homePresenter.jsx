import { observer } from "mobx-react-lite";
import { useState } from "react";
import HomeView from "../views/homeView";
import { getWeeklySessionCount } from "../utilities";

export default observer(function HomePresenter(props) {
    const sessionsCount = getWeeklySessionCount(props.model.sessions);
    const [isOpen, setIsOpen] = useState(false);
    const recentSessions = props.model.getWeekSessions();

    return (
        <HomeView
            sessionsCount={sessionsCount}
            recentSessions={recentSessions}
            showHistory={isOpen}
            onToggleHistory={() => setIsOpen(!isOpen)}
        />
    );
});
