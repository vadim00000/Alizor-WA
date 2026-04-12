import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarView from "../views/navBarView";
import HomeView from "../views/homeView";
import StatsView from "../views/statsView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";
import { Train } from "./trainPresenter.jsx";




const App = observer(
  function App(props) {
    return (
      <BrowserRouter>
        <NavBarView/> 
        <Routes>
          <Route path="/" element={<HomeView/>}/>
          <Route path="/stats" element={<StatsView/>}/>
          <Route path="/train" element={<Train model={props.model} />}/>
          <Route path="/records" element={<RecordsView/>}/>
          <Route path="/profile" element={<ProfileView/>}/>
        </Routes>
      </BrowserRouter>
    );
  }
);

export default App;