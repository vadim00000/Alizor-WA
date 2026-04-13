 import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarView from "../views/navBarView";
import HomeView from "../views/homeView";
import StatsPresenter from "./statsPresenter";
import TrainView from "../views/trainView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";
import { StatsProvider } from './statsContext';
import TrainStore from './trainStore';


const App = observer(
  function App(props) {
    // instantiate a hardcoded MobX train store here so StatsContext and other
    // parts of the app can listen to workouts. This makes it easy to later
    // replace with a Firebase-backed implementation.
    const trainModel = new TrainStore({
      // monthly volumes (example values)
      monthlyData: [
        { month: 'Jan', volume: 2500 },
        { month: 'Feb', volume: 2800 },
        { month: 'Mar', volume: 2100 },
        { month: 'Apr', volume: 3200 },
        { month: 'May', volume: 2900 },
        { month: 'Jun', volume: 3100 },
        { month: 'Jul', volume: 2600 },
        { month: 'Aug', volume: 3400 },
        { month: 'Sep', volume: 2700 },
        { month: 'Oct', volume: 3300 },
        { month: 'Nov', volume: 2900 },
        { month: 'Dec', volume: 3600 },
      ],
      // example sessions (a couple of sample sessions to seed the stats)
      sessions: [
        { date: '2026-04-01', muscles: ['Chest','Triceps'], volume: 1200, duration: 60, calories: 600 },
        { date: '2026-04-04', muscles: ['Legs','Glutes'], volume: 1500, duration: 70, calories: 750 },
      ],
      totalTime: 46,
      bestStreak: 18,
      totalVolume: 34200,
      totalSessions: 47,
      avgPerWeek: 4.2,
      prs: [
        { name: 'Bench Press', date: '2026-03-19', value: 102, unit: 'kg', allTime: true },
        { name: 'Squat', date: '2026-02-28', value: 140, unit: 'kg' },
      ],
    });
    return (
      <BrowserRouter>
        <StatsProvider trainModel={trainModel}>
          <NavBarView/> 
          <Routes>
            <Route path="/" element={<HomeView/>}/>
            <Route path="/stats" element={<StatsPresenter/>}/>
            <Route path="/train" element={<TrainView/>}/>
            <Route path="/records" element={<RecordsView/>}/>
            <Route path="/profile" element={<ProfileView/>}/>
          </Routes>
        </StatsProvider>
      </BrowserRouter>
    );
  }
);

export default App;