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
    model.setDraft("age", v === "" ? null : Number(v));
  }

  function setSexACB(e) {
    const v = e.target.value;
    model.setDraft("sex", v === "" ? null : v);
  }

  function setWeightKgACB(e) {
    const v = e.target.value;
    model.setDraft("weightKg", v === "" ? null : Number(v));
  }

  function setTargetWeightKgACB(e) {
    const v = e.target.value;
    model.setDraft("targetWeightKg", v === "" ? null : Number(v));
  }

  function saveACB() {
    model.commitChanges();
  }

  return (
    <ProfileView
      age={model.drafts.age}
      sex={model.drafts.sex}
      weightKg={model.drafts.weightKg}
      targetWeightKg={model.drafts.targetWeightKg}
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
