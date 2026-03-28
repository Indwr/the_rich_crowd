import { useMemo } from "react";
import { dobToInputValue, todayIsoMax } from "../utils/dobFormat";

type ProfileDobFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const ProfileDobField = ({ value, onChange, disabled }: ProfileDobFieldProps) => {
  const isoValue = useMemo(() => dobToInputValue(value), [value]);
  const maxDate = useMemo(() => todayIsoMax(), []);

  return (
    <div className="form-group form-group--dob">
      <label className="form-label" htmlFor="profile-dob">
        Date of Birth
      </label>
      <div className="profile-dob-wrap">
        <span className="profile-dob-wrap__icon" aria-hidden>
          <i className="fas fa-calendar-days" />
        </span>
        <input
          id="profile-dob"
          type="date"
          className="custom-input profile-dob-wrap__input"
          value={isoValue}
          min="1900-01-01"
          max={maxDate}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProfileDobField;
