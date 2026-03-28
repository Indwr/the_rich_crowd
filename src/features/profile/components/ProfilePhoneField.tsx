import { useEffect, useMemo, useRef, useState } from "react";
import {
  filterCountryDialOptions,
  resolveCountryDialOption,
} from "../constants/countryDialCodes";

type ProfilePhoneFieldProps = {
  countryCode: string;
  phone: string;
  onFieldChange: (field: "country_code" | "phone", value: string) => void;
  disabled?: boolean;
};

const ProfilePhoneField = ({
  countryCode,
  phone,
  onFieldChange,
  disabled,
}: ProfilePhoneFieldProps) => {
  const active = useMemo(
    () => resolveCountryDialOption(countryCode),
    [countryCode]
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCountryDialOptions(search), [search]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (dial: string) => {
    onFieldChange("country_code", dial);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="form-group form-group--phone-full">
      <label className="form-label" htmlFor="profile-phone-input">
        Phone Number
      </label>
      <div className="profile-phone-row">
        <div className="profile-phone-row__prefix profile-country-picker" ref={rootRef}>
          <button
            type="button"
            id="profile-country-dial"
            className="profile-country-picker__trigger"
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => !disabled && setOpen((o) => !o)}
          >
            <span className="profile-country-picker__trigger-flag" aria-hidden>
              {active.flag}
            </span>
            <span className="profile-country-picker__trigger-text">
              <span className="profile-country-picker__trigger-name">{active.name}</span>
              <span className="profile-country-picker__trigger-dial">{active.dial}</span>
            </span>
            <span className="profile-country-picker__chevron" aria-hidden>
              ▾
            </span>
          </button>

          {open && (
            <div className="profile-country-picker__dropdown" role="presentation">
              <input
                ref={searchInputRef}
                type="search"
                className="profile-country-picker__search"
                placeholder="Search country or code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label="Search country by name or dial code"
              />
              <ul className="profile-country-picker__list" role="listbox">
                {filtered.length === 0 ? (
                  <li className="profile-country-picker__empty">No country found</li>
                ) : (
                  filtered.map((c) => (
                    <li key={c.iso} role="none">
                      <button
                        type="button"
                        role="option"
                        aria-selected={c.iso === active.iso}
                        className={`profile-country-picker__item ${
                          c.iso === active.iso ? "is-active" : ""
                        }`}
                        onClick={() => pick(c.dial)}
                      >
                        <span className="profile-country-picker__item-flag" aria-hidden>
                          {c.flag}
                        </span>
                        <span className="profile-country-picker__item-main">
                          <span className="profile-country-picker__item-name">{c.name}</span>
                          <span className="profile-country-picker__item-dial">{c.dial}</span>
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        <input
          id="profile-phone-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className="custom-input profile-phone-row__input"
          placeholder="Phone number"
          value={phone}
          disabled={disabled}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ProfilePhoneField;
