import { useEffect, useState } from 'react'
import { Search } from 'react-feather'

const clear_d_icon = "/images/clear-d.png"
const clear_n_icon = "/images/clear-n.png"
const fewclouds_d_icon = "/images/fewclouds-d.png"
const fewclouds_n_icon = "/images/fewclouds-n.png"
const scatteredclouds = "/images/scattered_clouds.png"
const cloud_icon = "/images/clouds.png"
const drizzle_icon = "/images/drizzle.png"
const humidity_icon = "/images/humidity.png"
const mist_icon = "/images/mist.png"
const rain_icon = "/images/rain.png"
const snow_icon = "/images/snow.png"
const storm_icon = "/images/storm.png"
const wind_icon = "/images/wind.png"
const defaultCity = "Manila"

const Weather = ({ setBgImage }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const allIcons = {
    "01d": clear_d_icon,
    "01n": clear_n_icon,
    "02d": fewclouds_d_icon,
    "02n": fewclouds_n_icon,
    "03d": scatteredclouds,
    "03n": scatteredclouds,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": storm_icon,
    "11n": storm_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": mist_icon,
    "50n": mist_icon,
  }

  const allBackgrounds = {
    "01d": "/gifs/clear-d.gif",
    "01n": "/gifs/clear-n.gif",
    "02d": "/gifs/fewclouds-d.gif",
    "02n": "/gifs/fewclouds-n.gif",
    "03d": "/gifs/fewclouds-d.gif",
    "03n": "/gifs/fewclouds-n.gif",
    "04d": "/gifs/mist-d.gif",
    "04n": "/gifs/mist-n.gif",
    "09d": "/gifs/drizzle-d.gif",
    "09n": "/gifs/drizzle-n.gif",
    "10d": "/gifs/rain-d.gif",
    "10n": "/gifs/rain-n.gif",
    "11d": "/gifs/thunderstorm-d.gif",
    "11n": "/gifs/thunderstorm-d.gif",
    "13d": "/gifs/snow-d.gif",
    "13n": "/gifs/snow-n.gif",
    "50d": "/gifs/mist-d.gif",
    "50n": "/gifs/mist-n.gif",
  }

  const formatLocalTime = (timezoneOffset) => {
    const now = new Date();
    const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60000);

    const locationTimestamp = utcTimestamp + (timezoneOffset * 1000);

    const localDate = new Date(locationTimestamp);

    return localDate.toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatLocalDate = (timezoneOffset) => {
    const now = new Date();
    const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60000);
    const locationTimestamp = utcTimestamp + (timezoneOffset * 1000);
    const localDate = new Date(locationTimestamp);

    return localDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatClock = (unixTime, timezoneOffset) => {
    const utcTimestamp = (unixTime * 1000) + (timezoneOffset * 1000);
    const localDate = new Date(utcTimestamp);

    return localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTimezone = (timezoneOffset) => {
    const totalMinutes = Math.round(timezoneOffset / 60);
    const sign = totalMinutes >= 0 ? "+" : "-";
    const absoluteMinutes = Math.abs(totalMinutes);
    const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
    const minutes = String(absoluteMinutes % 60).padStart(2, "0");

    return `UTC${sign}${hours}:${minutes}`;
  };

  const formatCoordinate = (value) => (
    typeof value === "number" ? value.toFixed(2) : "--"
  );

  const capitalize = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

  const getWindDirection = (degrees) => {
    if (typeof degrees !== "number") return "Calm breeze";

    const directions = [
      "North",
      "North-East",
      "East",
      "South-East",
      "South",
      "South-West",
      "West",
      "North-West",
    ];
    const index = Math.round(degrees / 45) % 8;

    return directions[index];
  };

  const search = async (cityName) => {
    if (!cityName.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const iconCode = data.weather?.[0]?.icon || "01d";
      const icon = allIcons[iconCode] || clear_d_icon;
      const bgImage = allBackgrounds[iconCode] || "/gifs/clear-d.gif";

      setBgImage(bgImage);
      setWeatherData({
        condition: capitalize(data.weather?.[0]?.description || ""),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        feelsLike: Math.floor(data.main.feels_like),
        wind: data.wind.speed,
        windDirection: data.wind.deg,
        windGust: data.wind?.gust ? Math.round(data.wind.gust) : null,
        visibility: Math.round((data.visibility || 0) / 1000),
        cloudiness: data.clouds?.all ?? 0,
        temperature: Math.floor(data.main.temp),
        tempMin: Math.floor(data.main.temp_min),
        tempMax: Math.floor(data.main.temp_max),
        location: data.name,
        country: data.sys.country,
        timezone: formatTimezone(data.timezone),
        latitude: formatCoordinate(data.coord?.lat),
        longitude: formatCoordinate(data.coord?.lon),
        time: formatLocalTime(data.timezone),
        date: formatLocalDate(data.timezone),
        sunrise: formatClock(data.sys.sunrise, data.timezone),
        sunset: formatClock(data.sys.sunset, data.timezone),
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("We couldn't find that city. Try checking the spelling.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    search(city);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(city);
    }
  }

  useEffect(() => {
    search(defaultCity);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 rounded-xl">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950/5 shadow-[0_24px_70px_rgba(2,6,23,0.22)] backdrop-blur-md">
        <div className="pointer-events-none absolute -top-12 left-8 h-28 w-28 rounded-full bg-fuchsia-400/20 blur-3xl animate-anime-glow"></div>
        <div className="pointer-events-none absolute top-20 right-6 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl animate-anime-drift"></div>
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04)) pointer-events-none"></div>
            <div className="relative">
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="rounded-full border border-pink-200/20 bg-pink-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-pink-50">
                    Anime Weather
                  </span>
                  <span className="rounded-full border border-cyan-200/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-50">
                    Sky Senpai
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]">
                  Konnichiwa, weather scout.
                </h1>
                <p className="mt-3 text-white/75 text-sm sm:text-base max-w-lg leading-relaxed">
                  Search a city to see the live forecast, with a soft anime-inspired interface and a GIF backdrop that changes
                  with the weather.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search for City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-12 border border-white/10 rounded-full outline-none text-base px-6 bg-white/85 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-fuchsia-300 transition-all duration-200 shadow-[0_10px_30px_rgba(15,23,42,0.16)]"
                />
                <button
                  onClick={handleSearch}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 flex-shrink-0 cursor-pointer transition-all duration-200 shadow-[0_10px_25px_rgba(236,72,153,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95"
                >
                  <Search size={18} strokeWidth={2.5} className="text-white" aria-hidden="true" />
                </button>
              </div>
              {error ? (
                <p className="mb-5 text-sm text-rose-100 bg-rose-500/15 border border-rose-300/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  {error}
                </p>
              ) : null}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 animate-pulse">
                  <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white/80 text-lg">Loading...</p>
                </div>
              ) : weatherData ? (
                <div className="animate-fadeIn">
                  <div className="mb-6 rounded-[2.25rem] border border-white/10 bg-white/3 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="relative animate-float">
                          <div className="absolute inset-0 rounded-full bg-fuchsia-400/20 blur-xl"></div>
                          <img src={weatherData.icon} alt="weather" className="relative w-28 h-28 drop-shadow-2xl" />
                        </div>
                        <div>
                          <p className="text-fuchsia-100/90 text-sm sm:text-base uppercase tracking-[0.28em]">
                            {weatherData.condition}
                          </p>
                          <p className="text-white text-6xl sm:text-7xl font-bold tracking-tight leading-none mt-2 drop-shadow-[0_0_14px_rgba(255,255,255,0.15)]">
                            {weatherData.temperature}°C
                          </p>
                          <p className="text-white/90 text-lg sm:text-xl font-medium mt-2">
                            Feels like {weatherData.feelsLike}°C
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full border border-cyan-200/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-50">
                              {weatherData.country}
                            </span>
                            <span className="rounded-full border border-pink-200/20 bg-pink-400/10 px-3 py-1 text-xs text-pink-50">
                              {weatherData.date}
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                              {weatherData.timezone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-white text-2xl sm:text-3xl font-semibold">{weatherData.location}</p>
                        <p className="text-white/80 text-base sm:text-lg">{weatherData.country}</p>
                        <p className="text-white/70 text-sm sm:text-base mt-2">Local time</p>
                        <p className="text-white/90 text-base sm:text-lg">{weatherData.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[2rem] border border-fuchsia-200/12 bg-gradient-to-br from-fuchsia-500/8 to-white/3 p-5 backdrop-blur-sm shadow-[0_8px_22px_rgba(236,72,153,0.06)]">
                      <p className="text-pink-50/80 text-sm uppercase tracking-[0.22em]">Humidity</p>
                      <div className="mt-3 flex items-center gap-3">
                        <img src={humidity_icon} alt="humidity" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
                        <p className="text-white text-3xl font-semibold">{weatherData.humidity}%</p>
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-cyan-200/12 bg-gradient-to-br from-cyan-500/8 to-white/3 p-5 backdrop-blur-sm shadow-[0_8px_22px_rgba(34,211,238,0.06)]">
                      <p className="text-cyan-50/80 text-sm uppercase tracking-[0.22em]">Wind</p>
                      <div className="mt-3 flex items-center gap-3">
                        <img src={wind_icon} alt="wind" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
                        <div>
                          <p className="text-white text-3xl font-semibold">{weatherData.wind} km/h</p>
                          <p className="text-white/65 text-sm">
                            {getWindDirection(weatherData.windDirection)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-amber-200/12 bg-gradient-to-br from-amber-500/8 to-white/3 p-5 backdrop-blur-sm shadow-[0_8px_22px_rgba(251,191,36,0.06)]">
                      <p className="text-amber-50/80 text-sm uppercase tracking-[0.22em]">Pressure</p>
                      <p className="mt-3 text-white text-3xl font-semibold">{weatherData.pressure} hPa</p>
                      <p className="text-white/65 text-sm mt-1">Clouds {weatherData.cloudiness}%</p>
                    </div>
                    <div className="rounded-[2rem] border border-emerald-200/12 bg-gradient-to-br from-emerald-500/8 to-white/3 p-5 backdrop-blur-sm shadow-[0_8px_22px_rgba(16,185,129,0.06)]">
                      <p className="text-emerald-50/80 text-sm uppercase tracking-[0.22em]">Visibility</p>
                      <p className="mt-3 text-white text-3xl font-semibold">{weatherData.visibility} km</p>
                      <p className="text-white/65 text-sm mt-1">
                        Low {weatherData.tempMin}° / High {weatherData.tempMax}°
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[2rem] border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
                      <p className="text-white/60 text-sm uppercase tracking-[0.22em]">Sunrise</p>
                      <p className="mt-2 text-white text-2xl font-semibold">{weatherData.sunrise}</p>
                    </div>
                    <div className="rounded-[2rem] border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
                      <p className="text-white/60 text-sm uppercase tracking-[0.22em]">Sunset</p>
                      <p className="mt-2 text-white text-2xl font-semibold">{weatherData.sunset}</p>
                    </div>
                    <div className="rounded-[2rem] border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
                      <p className="text-white/60 text-sm uppercase tracking-[0.22em]">Coordinates</p>
                      <p className="mt-2 text-white text-xl font-semibold">
                        {weatherData.latitude}, {weatherData.longitude}
                      </p>
                    </div>
                    <div className="rounded-[2rem] border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
                      <p className="text-white/60 text-sm uppercase tracking-[0.22em]">Wind gust</p>
                      <p className="mt-2 text-white text-2xl font-semibold">
                        {weatherData.windGust ? `${weatherData.windGust} km/h` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-white/85 text-lg">Search for a city to reveal the forecast.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Weather
