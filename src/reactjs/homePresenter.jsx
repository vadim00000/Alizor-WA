import { observer } from "mobx-react-lite";
import HomeView from "../views/homeView";
import { getWeeklyStats } from "../utilities";
import { useState } from "react";


export default observer(function HomePresenter(props) {
    
    const workoutsCount = getWeeklyStats(props.model.workoutHistory);

    
    const [isOpen, setIsOpen] = useState(false);
    const recentWorkouts = props.model.getWeekWorkouts();

    return (
        <HomeView 
            workoutsCount={workoutsCount}
            recentWorkouts={recentWorkouts}
            showHistory={isOpen}
            onToggleHistory={() => setIsOpen(!isOpen)}
            getWorkout={(id) => props.model.getWorkout(id)}
        />
    );
});