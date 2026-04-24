import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AuthMenu from "../components/AuthMenu";
import { getToken } from "../utils/auth";

/** =========================
 *  Configuration
 *  ======================== */
const API_BASE = "http://localhost:8080/api";
const DEFAULT_CITY = "Gharuan";

/** Region-specific nature backgrounds */
const REGION_BACKGROUNDS = {
  // Asia
  IN: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1920&auto=format&fit=crop", // India - Taj Mahal
  CN: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1920&auto=format&fit=crop", // China - Mountains
  JP: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=1920&auto=format&fit=crop", // Japan - Mount Fuji
  TH: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&auto=format&fit=crop", // Thailand - Tropical
  // Europe
  GB: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop", // UK - Countryside
  FR: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format&fit=crop", // France - Lavender fields
  IT: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1920&auto=format&fit=crop", // Italy - Tuscany
  DE: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1920&auto=format&fit=crop", // Germany - Forest
  CH: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1920&auto=format&fit=crop", // Switzerland - Alps
  // Americas
  US: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop", // USA - Mountains
  CA: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1920&auto=format&fit=crop", // Canada - Lakes
  BR: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1920&auto=format&fit=crop", // Brazil - Rainforest
  // Oceania
  AU: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1920&auto=format&fit=crop", // Australia - Outback
  NZ: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1920&auto=format&fit=crop", // New Zealand - Mountains
  // Africa
  ZA: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?q=80&w=1920&auto=format&fit=crop", // South Africa - Safari
  // Default fallback
  DEFAULT: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1920&auto=format&fit=crop",
};

/** Weather mood backgrounds (fallback) */
const MOOD_BACKGROUNDS = {
  warm: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
  cool: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop",
  frost: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1920&auto=format&fit=crop",
  soft: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop",
  neutral: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1920&auto=format&fit=crop",
};

/** Material Symbols (filled/outlined) */
function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
      {name}
    </span>
  );
}

/** Pretty 12/24h toggle */
function TimeToggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(value === "12h" ? "24h" : "12h")}
      className={`
        relative inline-flex h-9 w-28 items-center rounded-full border border-white/20
        bg-white/10 backdrop-blur-md transition-all duration-300 ease-out
        hover:shadow-[0_0_0_2px_rgba(255,255,255,0.15)]
        focus:outline-none focus:ring-2 focus:ring-emerald-300/40 overflow-hidden
      `}
      aria-label="Toggle time format"
    >
      <span
        className={`
          absolute left-1 top-1 h-7 rounded-full bg-emerald-400/80 shadow-lg
          transition-transform duration-300 ease-out
          ${value === "24h" ? "translate-x-[3.25rem]" : "translate-x-0"}
        `}
        style={{ width: "3.25rem" }}
      />
      <span className={`z-10 w-1/2 text-center text-xs font-semibold ${value === "12h" ? "text-black" : "text-white/80"}`}>
        12h
      </span>
      <span className={`z-10 w-1/2 text-center text-xs font-semibold ${value === "24h" ? "text-black" : "text-white/80"}`}>
        24h
      </span>
    </button>
  );
}

/** Basic glass card with hover motion */
function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-xl border border-white/20 bg-black/10 p-6 backdrop-blur-xl transition-all
        duration-300 hover:translate-y-[-2px] hover:bg-black/15 hover:shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/** Format time per 12/24h */
function formatTime(date, mode = "12h") {
  if (mode === "24h") {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Build tiny “hourly” projection from current temp */
function buildHourlyFromCurrent(tempC) {
  const hours = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    const delta = Math.sin((i / 7) * Math.PI) * 2.5; // gentle curve
    hours.push({ label: hour.getHours(), temp: Math.round((tempC ?? 20) + delta) });
  }
  return hours;
}

/** Build “7-day” projection */
function buildDailyFromCurrent(tempC) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const res = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const t = tempC ?? 20;
    const max = Math.round(t + 2 + Math.sin((i / 7) * Math.PI) * 2);
    const min = Math.round(t - 3 + Math.cos((i / 7) * Math.PI) * 1.5);
    res.push({ day: i === 0 ? "Today" : days[d.getDay()], max, min, icon: i % 3 === 0 ? "partly_cloudy_day" : i % 3 === 1 ? "light_mode" : "cloud" });
  }
  return res;
}

export default function Dashboard() {
  /** =========================
   *  State
   *  ======================== */
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [city, setCity] = useState(localStorage.getItem("lastCity") || DEFAULT_CITY);
  const [search, setSearch] = useState("");
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem("timeFormat") || "12h");

  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favDetails, setFavDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Day/Night */
  const [isDaytime, setIsDaytime] = useState(true);

  /** =========================
   *  Effects
   *  ======================== */

  // Persist some prefs
  useEffect(() => localStorage.setItem("timeFormat", timeFormat), [timeFormat]);
  useEffect(() => localStorage.setItem("lastCity", city), [city]);
  useEffect(() => (token ? localStorage.setItem("token", token) : localStorage.removeItem("token")), [token]);

  // Determine day/night by local time
  useEffect(() => {
    const check = () => {
      const hr = new Date().getHours();
      setIsDaytime(hr >= 6 && hr < 18);
    };
    check();
    const id = setInterval(check, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Initial load: try geolocation first, then fetch weather & favorites
  useEffect(() => {
    // Always try to get user's location on first load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to saved city or default if geolocation fails/denied
          fetchCurrent(city);
        },
        { timeout: 5000 } // 5 second timeout
      );
    } else {
      fetchCurrent(city);
    }
    
    if (token) {
      fetchFavorites();
      fetchFavoriteDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /** =========================
   *  API Calls
   *  ======================== */

  async function fetchCurrent(q) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/weather/search?city=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch weather");
      setWeather(data);
      setCity(data?.name || q);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByLocation(lat, lon) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/weather/location?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch weather");
      setWeather(data);
      setCity(data?.name || "Your Location");
    } catch (e) {
      console.error(e);
      fetchCurrent(DEFAULT_CITY);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFavorites() {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/weather/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) return; // not logged in
      const data = await res.json();
      setFavorites(data || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchFavoriteDetails() {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/weather/favorites/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setFavDetails(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }

  async function addFavorite(cityName) {
    if (!token) return alert("Please login first.");
    try {
      const res = await fetch(`${API_BASE}/weather/favorites?city=${encodeURIComponent(cityName)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add favorite");
      await fetchFavorites();
      await fetchFavoriteDetails();
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeFavorite(cityName) {
    if (!token) return alert("Please login first.");
    try {
      const res = await fetch(`${API_BASE}/weather/favorites?city=${encodeURIComponent(cityName)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove favorite");
      await fetchFavorites();
      await fetchFavoriteDetails();
    } catch (e) {
      alert(e.message);
    }
  }

  /** =========================
   *  Derived UI Data
   *  ======================== */
  const now = new Date();
  const timeText = formatTime(now, timeFormat);

  const main = weather?.weather?.[0]?.main?.toLowerCase() || "";
  const mood = main.includes("clear")
    ? "warm"
    : main.includes("rain")
    ? "cool"
    : main.includes("snow")
    ? "frost"
    : main.includes("cloud")
    ? "soft"
    : "neutral";

  // Get background based on country, fallback to mood-based
  const countryCode = weather?.sys?.country;
  const bgUrl = countryCode && REGION_BACKGROUNDS[countryCode] 
    ? REGION_BACKGROUNDS[countryCode] 
    : MOOD_BACKGROUNDS[mood];

  // Mood filters that also react to day/night
  const moodFilters = {
    warm: isDaytime
      ? "brightness-[1.1] saturate-[1.25]"
      : "brightness-[0.82] saturate-[1.1] contrast-[0.95]",
    cool: isDaytime ? "brightness-[0.95] saturate-[1.1]" : "brightness-[0.78] blur-[1px]",
    frost: isDaytime ? "brightness-[1.05] contrast-[1.1]" : "brightness-[0.85] contrast-[1.1] blur-[1.5px]",
    soft: isDaytime ? "brightness-[1]" : "brightness-[0.78] blur-[1px]",
    neutral: isDaytime ? "brightness-[1.05]" : "brightness-[0.78] contrast-[0.95]",
  };

  // Header gradient by mood + day/night
  const headerGradients = {
    warm: isDaytime
      ? "from-amber-400/30 via-yellow-400/20 to-transparent"
      : "from-orange-700/30 via-amber-800/10 to-transparent",
    neutral: isDaytime
      ? "from-white/10 via-gray-400/10 to-transparent"
      : "from-gray-700/40 via-gray-900/30 to-transparent",
    cool: isDaytime
      ? "from-sky-400/30 via-blue-500/20 to-transparent"
      : "from-blue-900/40 via-slate-800/20 to-transparent",
    frost: isDaytime
      ? "from-cyan-300/30 via-blue-200/20 to-transparent"
      : "from-cyan-800/30 via-blue-900/20 to-transparent",
    soft: isDaytime
      ? "from-gray-400/20 via-gray-300/10 to-transparent"
      : "from-gray-800/40 via-gray-900/20 to-transparent",
  };

  const hourly = useMemo(
    () => buildHourlyFromCurrent(weather?.main?.temp),
    [weather?.main?.temp]
  );
  const daily = useMemo(
    () => buildDailyFromCurrent(weather?.main?.temp),
    [weather?.main?.temp]
  );

  /** =========================
   *  UI
   *  ======================== */
  return (
    <div
      className={`
        relative flex min-h-screen w-full flex-col overflow-x-hidden font-display
        transition-all duration-1000 ease-in-out
        ${isDaytime ? "bg-white/5" : "bg-black/10"}
      `}
    >
      {/* Background image */}
      <div
        className={`
          absolute inset-0 -z-10 bg-cover bg-center transition-all duration-700
          ${moodFilters[mood]}
        `}
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden="true"
      />

      {/* Subtle animated overlay for “living” background */}
      <div
        className={`
          pointer-events-none absolute inset-0 -z-10
          bg-gradient-to-b ${headerGradients[mood]}
          mix-blend-soft-light transition-all duration-700
        `}
      />

      {/* CONTENT CONTAINER */}
      <div className="flex flex-1 justify-center px-4 py-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex w-full max-w-7xl flex-col gap-4 sm:gap-5">

          {/* HEADER — glass morphism + gradient glow */}
          <header
            className={`
              relative z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-white/20
              bg-white/10 px-4 py-3 backdrop-blur-xl sm:px-6
              before:absolute before:inset-0 before:-z-10 before:rounded-2xl
              before:bg-gradient-to-r before:${headerGradients[mood]}
              transition-all duration-700
            `}
          >
            <div className="flex items-center gap-2 text-white">
              <Icon name="near_me" className="text-2xl sm:text-3xl" />
              <h2 className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-base sm:text-xl font-bold">
                <span>{weather ? `${weather.name}, ${weather.sys?.country}` : city}</span>
                <span className="flex items-center gap-1 text-sm sm:text-base">
                  · {timeText}
                  <Icon name={isDaytime ? "light_mode" : "nightlight_round"} className="text-base sm:text-lg opacity-90" />
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <label className="flex h-10 sm:h-11 flex-1 sm:w-72">
                <div className="flex w-full flex-1 items-stretch rounded-full bg-white/20 backdrop-blur-md focus-within:ring-2 focus-within:ring-emerald-300/40">
                  <div className="flex items-center justify-center pl-3 sm:pl-4 text-white">
                    <Icon name="search" className="text-lg sm:text-xl" />
                  </div>
                  <input
                    className="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full border-none bg-transparent px-3 sm:px-4 text-sm sm:text-base font-normal text-white placeholder:text-white/70 focus:outline-none focus:ring-0"
                    placeholder="Search city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchCurrent(search || city)}
                  />
                </div>
              </label>

              {/* Quick Search Button */}
              <button
                onClick={() => fetchCurrent(search || city)}
                className="group flex h-10 sm:h-11 items-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-emerald-400/90 px-3 sm:px-4 text-black backdrop-blur-md transition-all hover:bg-emerald-300"
                title="Search"
              >
                <Icon name="travel_explore" className="text-lg sm:text-xl" />
                <span className="hidden sm:inline text-sm font-semibold">Update</span>
              </button>

              {/* Auth Menu */}
              <AuthMenu />
            </div>
          </header>

          {/* GRID */}
          <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Current Weather */}
              <Card className="@container p-5 sm:p-6 relative">
                {/* Time Toggle - Positioned in top-right */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 scale-90">
                  <TimeToggle value={timeFormat} onChange={setTimeFormat} />
                </div>
                
                <div className="flex flex-col items-start justify-between gap-4 @md:flex-row pt-8 sm:pt-0">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm sm:text-base text-white/90">
                      {weather ? `${weather.name}, ${weather.sys?.country}` : city}, {timeText}
                    </p>
                    <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white">
                      {loading
                        ? "…"
                        : weather?.main?.temp !== undefined
                        ? `${Math.round(weather.main.temp)}°C`
                        : "--"}
                    </p>
                    <p className="text-sm sm:text-base text-white/80">
                      {weather
                        ? `Feels like ${Math.round(weather.main.feels_like)}°C · H:${Math.round(weather.main.temp_max)}° L:${Math.round(weather.main.temp_min)}°`
                        : "—"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 @md:items-end">
                    <Icon
                      name={
                        main.includes("rain")
                          ? "rainy"
                          : main.includes("cloud")
                          ? "partly_cloudy_day"
                          : main.includes("snow")
                          ? "ac_unit"
                          : "light_mode"
                      }
                      className="text-6xl sm:text-7xl text-white"
                    />
                    <p className="text-base sm:text-lg font-medium text-white">
                      {weather?.weather?.[0]?.description
                        ? weather.weather[0].description.replace(/\b\w/g, (c) => c.toUpperCase())
                        : "—"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Hourly Forecast — shrunk so no horizontal scroll */}
              <Card className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white">
                    Hourly Forecast
                  </h3>
                </div>
                <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 md:grid-cols-7">
                  {hourly.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 rounded-lg bg-white/10 p-2.5 text-center transition hover:bg-white/15"
                    >
                      <p className="text-xs sm:text-sm font-medium text-white">
                        {timeFormat === "24h"
                          ? `${String(h.label).padStart(2, "0")}:00`
                          : `${((h.label + 11) % 12) + 1} ${h.label < 12 ? "AM" : "PM"}`}
                      </p>
                      <Icon
                        name={idx % 3 === 0 ? "partly_cloudy_day" : idx % 3 === 1 ? "light_mode" : "cloud"}
                        className="text-2xl sm:text-3xl text-white"
                      />
                      <p className="text-sm sm:text-base font-semibold text-white">{h.temp}°</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* 7-Day Forecast */}
              <Card className="p-4 sm:p-5">
                <h3 className="mb-4 text-base sm:text-lg font-bold leading-tight tracking-tight text-white">
                  7-Day Forecast
                </h3>
                <div className="flex flex-col gap-3">
                  {daily.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between transition hover:opacity-80"
                    >
                      <p className="w-14 text-sm sm:text-base font-medium text-white/90">{d.day}</p>
                      <Icon name={d.icon} className="text-2xl sm:text-3xl text-white" />
                      <p className="w-20 text-right text-sm sm:text-base font-medium text-white">
                        {d.max}° / {d.min}°
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Favorites (Add / List / Details) - Only show if logged in */}
              {token && (
                <Card className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-white">Favorites</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addFavorite(city)}
                        className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/25"
                        title="Add current city to favorites"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => {
                          fetchFavorites();
                          fetchFavoriteDetails();
                        }}
                        className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/25"
                        title="Refresh favorites"
                      >
                        ↻
                      </button>
                    </div>
                  </div>

                {/* Favorited list quick actions */}
                <div className="flex flex-wrap gap-2">
                  {favorites.length === 0 && (
                    <p className="text-sm text-white/80">No favorites yet.</p>
                  )}
                  {favorites.map((f) => (
                    <div
                      key={f.id}
                      className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white transition hover:bg-white/20"
                    >
                      <button
                        className="text-sm font-medium"
                        onClick={() => fetchCurrent(f.cityName)}
                        title="View weather"
                      >
                        {f.cityName}
                      </button>
                      <button
                        onClick={() => removeFavorite(f.cityName)}
                        className="rounded-full bg-red-500/80 px-2 py-0.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Live favorite details */}
                {favDetails.length > 0 && (
                  <>
                    <hr className="my-4 border-white/20" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {favDetails.map((c, idx) => (
                        <div
                          key={`${c.cityName}-${idx}`}
                          className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition hover:bg-white/10"
                        >
                          <div className="flex min-w-0 flex-col">
                            <p className="truncate text-sm font-semibold text-white">
                              {c.cityName}
                            </p>
                            <p className="truncate text-xs text-white/80">{c.error ? c.error : c.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              {c.temperature !== undefined ? `${Math.round(c.temperature)}°C` : "--"}
                            </p>
                            <p className="text-xs text-white/70">{c.country || ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer (optional) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
