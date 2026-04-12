import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarView from "../views/navBarView";
import HomeView from "../views/homeView";
import StatsView from "../views/statsView";
import TrainView from "../views/trainView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";
import { AuthPresenter } from "../presenters/authPresenter";
import { authModel } from "../models/authModel";
import { sessionModel } from "../models/sessionModel";

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
        <Route path="/train" element={<TrainView />} />
        <Route path="/records" element={<RecordsView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  );
});

export default App;