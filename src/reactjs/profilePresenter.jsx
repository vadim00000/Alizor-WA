import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView";

const ProfilePresenter = observer(function ProfilePresenterRender(props) {
  const model = props.model;

  const loadState = model.loadProfilePromiseState;
  const profileLoading =
    !!loadState.promise &&
    loadState.data === null &&
    !loadState.error;

  const saveState = model.saveProfilePromiseState;
  const saveInFlight =
    !!saveState.promise &&
    saveState.data === null &&
    !saveState.error;

  function setAgeACB(e) {
    const v = e.target.value;
    model.setAge(v === "" ? null : Number(v));
  }

  function setSexACB(e) {
    const v = e.target.value;
    model.setSex(v === "" ? null : v);
  }

  function setWeightKgACB(e) {
    const v = e.target.value;
    model.setWeightKg(v === "" ? null : Number(v));
  }

  function setTargetWeightKgACB(e) {
    const v = e.target.value;
    model.setTargetWeightKg(v === "" ? null : Number(v));
  }

  function saveACB() {
    model.setSave();
  }

  return (
    <ProfileView
      age={model.age}
      sex={model.sex}
      weightKg={model.weightKg}
      targetWeightKg={model.targetWeightKg}
      profileLoading={profileLoading}
      saveInFlight={saveInFlight}
      loadError={loadState.error}
      saveError={saveState.error}
      onAgeChange={setAgeACB}
      onSexChange={setSexACB}
      onWeightKgChange={setWeightKgACB}
      onTargetWeightKgChange={setTargetWeightKgACB}
      onSave={saveACB}
    />
  );
});

export { ProfilePresenter };
