import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import NavBarView from "../views/navBarView";
import HomePresenter from "./homePresenter";
import StatsView from "../views/statsView";
import TrainView from "../views/trainView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";

const App = observer(
  function App(props) {
    return (
      <BrowserRouter>
        <NavBarView/> 
        <Routes>
          <Route path="/" element={<HomePresenter model={props.model}/>}/>
          <Route path="/stats" element={<StatsView/>}/>
          <Route path="/train" element={<TrainView/>}/>
          <Route path="/records" element={<RecordsView/>}/>
          <Route path="/profile" element={<ProfileView/>}/>
        </Routes>
      </BrowserRouter>
    );
  }
);


export default App;


