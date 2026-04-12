 import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarView from "../views/navBarView";
import HomeView from "../views/homeView";
import StatsPresenter from "./statsPresenter";
import TrainView from "../views/trainView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";
import { StatsProvider } from './statsContext';


const App = observer(
  function App(props) {
    return (
      <BrowserRouter>
        <StatsProvider>
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