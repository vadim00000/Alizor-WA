import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../css/navBar.css";
import "../css/home.css";
import "../css/profile.css";
import "../css/train.css";
import "../css/session.css";

import {NavBar} from "./navBarPresenter.jsx";
import HomePresenter from "./homePresenter";
import { StatsPresenter } from "./statsPresenter.jsx";
import RecordsView from "../views/recordsView";
import { AuthPresenter } from "./authPresenter";
import { ProfilePresenter } from "./profilePresenter";
import { Train } from "./trainPresenter.jsx";

import { reactiveTrainModel } from "../models/mobxReactiveModel.js";
import { reactiveSessionModel } from "../models/mobxReactiveModel.js";
import { reactiveProfileModel } from "../models/mobxReactiveModel.js";
import { reactiveAuthModel } from "../models/mobxReactiveModel.js";
import { reactiveStatsModel } from "../models/mobxReactiveModel.js";


const App = observer(function App() {
  if (!reactiveSessionModel.authReady) {
    return null;
  }

  if (!reactiveSessionModel.user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPresenter model={reactiveAuthModel} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePresenter model={reactiveTrainModel}/>}/>
  <Route path="/stats" element={<StatsPresenter trainModel={reactiveTrainModel} statsModel={reactiveStatsModel} profileModel={reactiveProfileModel} />} />
        <Route path="/train" element={<Train model={reactiveTrainModel} />} />
        <Route path="/records" element={<RecordsView />} />
        <Route path="/profile" element={<ProfilePresenter model={reactiveProfileModel} />} />
      </Routes>
    </BrowserRouter>
  );
});


export default App;


