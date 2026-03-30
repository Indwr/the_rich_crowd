import { useMemo, useRef } from "react";
import { dobToInputValue, todayIsoMax } from "../utils/dobFormat";

type ProfileDobFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const ProfileDobField = ({ value, onChange, disabled }: ProfileDobFieldProps) => {
  const isoValue = useMemo(() => dobToInputValue(value), [value]);
  const maxDate = useMemo(() => todayIsoMax(), []);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isTokenPocketBrowser = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /tokenpocket/i.test(navigator.userAgent);
  }, []);
  const isNativeDateInputSupported = useMemo(() => {
    if (typeof document === "undefined") return true;
    const input = document.createElement("input");
    input.setAttribute("type", "date");
    return input.type === "date";
  }, []);
  const useTextFallback = isTokenPocketBrowser || !isNativeDateInputSupported;
  const textValue = useMemo(() => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [yyyy, mm, dd] = value.split("-");
      return `${dd}-${mm}-${yyyy}`;
    }
    return value;
  }, [value]);

  const openDatePicker = () => {
    if (useTextFallback) return;
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    const picker = (input as HTMLInputElement & { showPicker?: () => void }).showPicker;
    if (typeof picker === "function") {
      try {
        picker.call(input);
      } catch (_error) {
        // Some wallets/browsers block showPicker until explicit user gesture.
      }
    }
  };

  return (
    <div className="form-group form-group--dob">
      <label className="form-label" htmlFor="profile-dob">
        Date of Birth
      </label>
      <div className="profile-dob-wrap" onClick={openDatePicker}>
        <span className="profile-dob-wrap__icon" aria-hidden>
          <i className="fas fa-calendar-days" />
        </span>
        <input
          ref={inputRef}
          id="profile-dob"
          type={useTextFallback ? "text" : "date"}
          className="custom-input profile-dob-wrap__input"
          value={useTextFallback ? textValue : isoValue}
          min="1900-01-01"
          max={useTextFallback ? undefined : maxDate}
          placeholder={useTextFallback ? "DD-MM-YYYY" : undefined}
          inputMode={useTextFallback ? "numeric" : undefined}
          pattern={useTextFallback ? "\\d{1,2}[-/]\\d{1,2}[-/]\\d{4}" : undefined}
          disabled={disabled}
          onFocus={openDatePicker}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProfileDobField;
