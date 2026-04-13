import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarView from "../views/navBarView";
import HomeView from "../views/homeView";
import StatsView from "../views/statsView";
import RecordsView from "../views/recordsView";
import { AuthPresenter } from "../presenters/authPresenter";
import { ProfilePresenter } from "../presenters/profilePresenter";
import { authModel } from "../models/authModel";
import {
  connectToPersistence,
  connectProfilePersistence,
} from "../models/firestoreModel";
import { profileModel } from "../models/profileModel";
import { sessionModel } from "../models/sessionModel";
import { trainModel } from "../models/trainModel";
import { Train } from "./trainPresenter.jsx";

connectToPersistence(trainModel, sessionModel);
connectProfilePersistence(profileModel, sessionModel);

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
      <NavBarView />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/stats" element={<StatsView />} />
        <Route path="/train" element={<Train model={trainModel} />} />
        <Route path="/records" element={<RecordsView />} />
        <Route path="/profile" element={<ProfilePresenter model={profileModel} />} />
      </Routes>
    </BrowserRouter>
  );
});

export default App;