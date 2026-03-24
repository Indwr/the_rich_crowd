import { useCallback, useEffect, useMemo, useState } from "react";
import { getIndiaDistrictsForState } from "../constants/indiaDistrictsByState";
import SearchableGeoSelect, { type GeoSelectOption } from "./SearchableGeoSelect";

type GeoModule = typeof import("country-state-city");

let geoLoadPromise: Promise<GeoModule> | null = null;
function loadCountryStateCity(): Promise<GeoModule> {
  if (!geoLoadPromise) geoLoadPromise = import("country-state-city");
  return geoLoadPromise;
}

type FormSlice = {
  country: string;
  state: string;
  city: string;
  district: string;
};

type ProfileGeoCascadeProps = {
  form: FormSlice;
  onFieldChange: (field: keyof FormSlice, value: string) => void;
  disabled?: boolean;
};

const ProfileGeoCascade = ({ form, onFieldChange, disabled }: ProfileGeoCascadeProps) => {
  const [geo, setGeo] = useState<GeoModule | null>(null);
  const [countryIso, setCountryIso] = useState("");
  const [stateCode, setStateCode] = useState("");

  useEffect(() => {
    let alive = true;
    loadCountryStateCity().then((m) => {
      if (alive) setGeo(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  const Country = geo?.Country;
  const State = geo?.State;
  const City = geo?.City;

  const countryOptions: GeoSelectOption[] = useMemo(() => {
    if (!Country) return [];
    return Country.sortByIsoCode(Country.getAllCountries()).map((c) => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
      searchText: `${c.name} ${c.isoCode} ${c.phonecode ?? ""}`,
    }));
  }, [Country]);

  const stateOptions: GeoSelectOption[] = useMemo(() => {
    if (!State || !countryIso) return [];
    return State.getStatesOfCountry(countryIso)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => ({
        value: s.isoCode,
        label: s.name,
        searchText: `${s.name} ${s.isoCode}`,
      }));
  }, [State, countryIso]);

  const cityOptions: GeoSelectOption[] = useMemo(() => {
    if (!City || !countryIso || !stateCode) return [];
    return City.getCitiesOfState(countryIso, stateCode)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({
        value: c.name,
        label: c.name,
        searchText: c.name,
      }));
  }, [City, countryIso, stateCode]);

  const districtOptions: GeoSelectOption[] = useMemo(() => {
    if (countryIso !== "IN" || !stateCode) return [];
    const list = getIndiaDistrictsForState(stateCode);
    return list.map((d) => ({
      value: d,
      label: d,
      searchText: d,
    }));
  }, [countryIso, stateCode]);

  const showDistrictDropdown =
    countryIso === "IN" && stateCode && districtOptions.length > 0;

  useEffect(() => {
    if (!Country) return;
    if (!form.country) {
      setCountryIso("");
      return;
    }
    const c = Country.getAllCountries().find((x) => x.name === form.country);
    setCountryIso(c?.isoCode ?? "");
  }, [Country, form.country]);

  useEffect(() => {
    if (!State) return;
    if (!form.state) {
      setStateCode("");
      return;
    }
    if (!countryIso) return;
    const s = State.getStatesOfCountry(countryIso).find((x) => x.name === form.state);
    setStateCode(s?.isoCode ?? "");
  }, [State, countryIso, form.state]);

  const onCountryChange = useCallback(
    (iso: string) => {
      if (!Country) return;
      setCountryIso(iso);
      setStateCode("");
      const c = Country.getCountryByCode(iso);
      onFieldChange("country", c?.name ?? "");
      onFieldChange("state", "");
      onFieldChange("city", "");
      onFieldChange("district", "");
    },
    [Country, onFieldChange]
  );

  const onStateChange = useCallback(
    (iso: string) => {
      if (!State) return;
      setStateCode(iso);
      const st = State.getStatesOfCountry(countryIso).find((s) => s.isoCode === iso);
      onFieldChange("state", st?.name ?? "");
      onFieldChange("city", "");
      onFieldChange("district", "");
    },
    [State, countryIso, onFieldChange]
  );

  const onCityChange = useCallback(
    (name: string) => {
      onFieldChange("city", name);
      onFieldChange("district", "");
    },
    [onFieldChange]
  );

  const onDistrictChange = useCallback(
    (v: string) => {
      onFieldChange("district", v);
    },
    [onFieldChange]
  );

  if (!geo) {
    return (
      <div className="form-group form-group--geo-loading">
        <p className="profile-geo-loading">Loading country &amp; region lists…</p>
      </div>
    );
  }

  return (
    <>
      <SearchableGeoSelect
        id="profile-country"
        label="Country"
        placeholder="Search country…"
        options={countryOptions}
        value={countryIso}
        onChange={onCountryChange}
        disabled={disabled}
      />

      <SearchableGeoSelect
        id="profile-state"
        label="State / Province"
        placeholder="Search state…"
        options={stateOptions}
        value={stateCode}
        onChange={onStateChange}
        disabled={disabled || !countryIso}
      />

      <SearchableGeoSelect
        id="profile-city"
        label="City"
        placeholder="Search city…"
        options={cityOptions}
        value={form.city}
        onChange={onCityChange}
        disabled={disabled || !countryIso || !stateCode}
      />

      {showDistrictDropdown ? (
        <SearchableGeoSelect
          id="profile-district"
          label="District"
          placeholder="Search district…"
          options={districtOptions}
          value={form.district}
          onChange={onDistrictChange}
          disabled={disabled || !form.city}
        />
      ) : (
        <div className="form-group">
          <label className="form-label" htmlFor="profile-district-text">
            District
          </label>
          <input
            id="profile-district-text"
            type="text"
            className="custom-input"
            placeholder="District / county"
            value={form.district}
            disabled={disabled || !countryIso || !stateCode || !form.city}
            onChange={(e) => onFieldChange("district", e.target.value)}
          />
        </div>
      )}
    </>
  );
};

export default ProfileGeoCascade;
