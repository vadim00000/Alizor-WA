import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";
import NavBarView from "../views/navBarView";
import HomePresenter from "./homePresenter";
import StatsView from "../views/statsView";
import RecordsView from "../views/recordsView";
import ProfileView from "../views/profileView";
import { AuthPresenter } from "../presenters/authPresenter";
import { authModel } from "../models/authModel";
import { connectToPersistence } from "../models/firestoreModel";
import { sessionModel } from "../models/sessionModel";
import { trainModel } from "../models/trainModel";
import { Train } from "./trainPresenter.jsx";

connectToPersistence(trainModel, sessionModel);

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
        <Route path="/" element={<HomePresenter model={trainModel}/>}/>
        <Route path="/stats" element={<StatsView />} />
        <Route path="/train" element={<Train model={trainModel} />} />
        <Route path="/records" element={<RecordsView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  );
});


export default App;


