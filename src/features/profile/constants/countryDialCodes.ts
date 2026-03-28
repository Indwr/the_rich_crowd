export type CountryDialOption = {
  iso: string;
  dial: string;
  flag: string;
  name: string;
};

/** Common dial codes — flag emoji + ITU-T E.164 prefix for profile phone row */
export const COUNTRY_DIAL_OPTIONS: CountryDialOption[] = [
  { iso: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { iso: "US", dial: "+1", flag: "🇺🇸", name: "US / Canada (+1)" },
  { iso: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { iso: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
  { iso: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { iso: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
  { iso: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { iso: "NP", dial: "+977", flag: "🇳🇵", name: "Nepal" },
  { iso: "LK", dial: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { iso: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { iso: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia" },
  { iso: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { iso: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { iso: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { iso: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { iso: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { iso: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { iso: "ZA", dial: "+27", flag: "🇿🇦", name: "South Africa" },
  { iso: "PH", dial: "+63", flag: "🇵🇭", name: "Philippines" },
  { iso: "ID", dial: "+62", flag: "🇮🇩", name: "Indonesia" },
  { iso: "TH", dial: "+66", flag: "🇹🇭", name: "Thailand" },
  { iso: "VN", dial: "+84", flag: "🇻🇳", name: "Vietnam" },
  { iso: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
  { iso: "HK", dial: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { iso: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { iso: "KR", dial: "+82", flag: "🇰🇷", name: "South Korea" },
  { iso: "NZ", dial: "+64", flag: "🇳🇿", name: "New Zealand" },
  { iso: "QA", dial: "+974", flag: "🇶🇦", name: "Qatar" },
  { iso: "KW", dial: "+965", flag: "🇰🇼", name: "Kuwait" },
  { iso: "BH", dial: "+973", flag: "🇧🇭", name: "Bahrain" },
  { iso: "OM", dial: "+968", flag: "🇴🇲", name: "Oman" },
  { iso: "TR", dial: "+90", flag: "🇹🇷", name: "Türkiye" },
  { iso: "RU", dial: "+7", flag: "🇷🇺", name: "Russia" },
  { iso: "NG", dial: "+234", flag: "🇳🇬", name: "Nigeria" },
  { iso: "KE", dial: "+254", flag: "🇰🇪", name: "Kenya" },
  { iso: "EG", dial: "+20", flag: "🇪🇬", name: "Egypt" },
];

export function resolveCountryDialOption(stored: string | number | undefined): CountryDialOption {
  const raw = stored === undefined || stored === null ? "" : String(stored).trim();
  if (!raw) return COUNTRY_DIAL_OPTIONS[0];

  const digitsOnly = raw.replace(/\D/g, "");
  const withPlus = raw.startsWith("+") ? raw : digitsOnly ? `+${digitsOnly}` : raw;

  const match = COUNTRY_DIAL_OPTIONS.find((c) => {
    if (c.dial === withPlus) return true;
    const d = c.dial.replace("+", "");
    return d === digitsOnly || `+${d}` === withPlus;
  });

  return match ?? COUNTRY_DIAL_OPTIONS[0];
}

/** Filter by country name, ISO code, or dial digits (e.g. "india", "91", "+971"). */
export function filterCountryDialOptions(query: string): CountryDialOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRY_DIAL_OPTIONS;

  const digits = q.replace(/\D/g, "");

  return COUNTRY_DIAL_OPTIONS.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.iso.toLowerCase().includes(q)) return true;
    if (c.dial.toLowerCase().includes(q)) return true;
    if (digits.length > 0 && c.dial.replace(/\D/g, "").includes(digits)) return true;
    return false;
  });
}
