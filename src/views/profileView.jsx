export function ProfileView(props) {
  if (props.profileLoading) {
    return <p>Loading profile…</p>;
  }

  return (
    <div>
      <h1>Profile</h1>

      {props.loadError && (
        <p>
          Could not load profile:{" "}
          {props.loadError?.message ?? String(props.loadError)}
        </p>
      )}

      <label>
        Age
        <input
          type="number"
          min={0}
          max={150}
          value={props.age ?? ""}
          onChange={props.onAgeChange}
        />
      </label>

      <label>
        Sex
        <select value={props.sex ?? ""} onChange={props.onSexChange}>
          <option value="">—</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Weight (kg)
        <input
          type="number"
          min={0}
          step="0.1"
          value={props.weightKg ?? ""}
          onChange={props.onWeightKgChange}
        />
      </label>

      <label>
        Target weight (kg)
        <input
          type="number"
          min={0}
          step="0.1"
          value={props.targetWeightKg ?? ""}
          onChange={props.onTargetWeightKgChange}
        />
      </label>

      <button
        type="button"
        onClick={props.onSave}
        disabled={props.saveInFlight}
      >
        Save
      </button>

      {props.saveError && (
        <p>
          Could not save profile:{" "}
          {props.saveError?.message ?? String(props.saveError)}
        </p>
      )}
    </div>
  );
}