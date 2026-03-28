import { useEffect, useMemo, useRef, useState } from "react";

export type GeoSelectOption = {
  value: string;
  label: string;
  searchText: string;
};

type SearchableGeoSelectProps = {
  id: string;
  label: string;
  placeholder: string;
  options: GeoSelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyHint?: string;
};

const SearchableGeoSelect = ({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  emptyHint = "No matches",
}: SearchableGeoSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    const hit = options.find((o) => o.value === value);
    if (hit) return hit.label;
    if (value) return value;
    return "";
  }, [options, value]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.searchText.toLowerCase().includes(q));
  }, [options, search]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const el = rootRef.current?.querySelector<HTMLInputElement>(".profile-geo-select__search");
      el?.focus();
    }, 0);
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

  return (
    <div className="form-group profile-geo-select" ref={rootRef}>
      <label className="form-label" htmlFor={`${id}-trigger`}>
        {label}
      </label>
      <div className="profile-geo-select__inner">
        <button
          type="button"
          id={`${id}-trigger`}
          className="profile-geo-select__trigger"
          disabled={disabled || options.length === 0}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => !disabled && options.length > 0 && setOpen((o) => !o)}
        >
          <span className="profile-geo-select__trigger-text">
            {selectedLabel || (options.length === 0 ? "—" : "Select…")}
          </span>
          <span className="profile-geo-select__chevron" aria-hidden>
            ▾
          </span>
        </button>

        {open && (
          <div className="profile-geo-select__dropdown" role="presentation">
            <input
              type="search"
              className="profile-geo-select__search"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Search ${label}`}
            />
            <ul className="profile-geo-select__list" role="listbox">
              {filtered.length === 0 ? (
                <li className="profile-geo-select__empty">{emptyHint}</li>
              ) : (
                filtered.map((o) => (
                  <li key={o.value} role="none">
                    <button
                      type="button"
                      role="option"
                      className={`profile-geo-select__item ${o.value === value ? "is-active" : ""}`}
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      {o.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableGeoSelect;
