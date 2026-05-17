import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";

import {NavBar} from "./navBarPresenter.jsx";
import HomePresenter from "./homePresenter";
import StatsPresenter from "./statsPresenter";
import RecordsView from "../views/recordsView";
import { AuthPresenter } from "./authPresenter";
import { ProfilePresenter } from "./profilePresenter";
import { authModel } from "../models/authModel";
import {
  connectAuthSession,
  connectToPersistence,
  connectProfilePersistence,
} from "../models/firestoreModel";
import { profileModel } from "../models/profileModel";
import { sessionModel } from "../models/sessionModel";
import { trainModel } from "../models/trainModel";
import statsModel from "../models/statsModel";
import { connectStatsPersistence } from "../models/firestoreModel";
import { Train } from "./trainPresenter.jsx";
import { StatsProvider } from "./statsContext";

connectAuthSession(sessionModel);
connectToPersistence(trainModel, sessionModel);
connectProfilePersistence(profileModel, sessionModel);
connectStatsPersistence(statsModel, sessionModel);

const App = observer(function App() {
  if (!sessionModel.authReady) {
    return null;
  }

  if (!sessionModel.user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPresenter model={authModel} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<HomePresenter model={trainModel}/>}/>
            <Route path="/stats" element={<StatsPresenter trainModel={trainModel} statsModel={statsModel} />} />
          <Route path="/train" element={<Train model={trainModel} />} />
          <Route path="/records" element={<RecordsView />} />
          <Route path="/profile" element={<ProfilePresenter model={profileModel} />} />
        </Routes>
    </BrowserRouter>
  );
});


export default App;


