export function ProfileView(props) {
  if (props.profileLoading) {
    return (
      <div className="profile-container">
        <p className="profile-empty">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <h1 className="profile-title">Profile <span>settings.</span></h1>
        <p className="profile-sub">Keep your fitness profile aligned with your progress.</p>
      </div>

      {props.loadError && (
        <div className="profile-alert">
          Could not load profile: {props.loadError?.message ?? String(props.loadError)}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-field">
          <label htmlFor="profile-age">Age</label>
          <input
            id="profile-age"
            type="number"
            min={0}
            max={150}
            value={props.age ?? ""}
            onChange={props.onAgeChange}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-sex">Sex</label>
          <select id="profile-sex" value={props.sex ?? ""} onChange={props.onSexChange}>
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="profile-field">
          <label htmlFor="profile-weight">Weight (kg)</label>
          <input
            id="profile-weight"
            type="number"
            min={0}
            step="0.1"
            value={props.weightKg ?? ""}
            onChange={props.onWeightKgChange}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-target-weight">Target weight (kg)</label>
          <input
            id="profile-target-weight"
            type="number"
            min={0}
            step="0.1"
            value={props.targetWeightKg ?? ""}
            onChange={props.onTargetWeightKgChange}
          />
        </div>

        <button
          className="profile-save"
          type="button"
          onClick={props.onSave}
          disabled={props.saveInFlight}
        >
          {props.saveInFlight ? "Saving..." : "Save"}
        </button>
      </div>

      {props.saveError && (
        <div className="profile-alert">
          Could not save profile: {props.saveError?.message ?? String(props.saveError)}
        </div>
      )}
    </div>
  );
}