import { useEffect, useState } from 'react'

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

const Weather = ({ setBgImage }) => {
  const [weatherData, setWeatherData] = useState(false);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      hour24: true
    });
  };

  const search = async (cityName) => {
    if (!cityName.trim()) return;

    setIsLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      const bgImage = allBackgrounds[data.weather[0].icon] || "/gifs/clear-d.gif";

      setBgImage(bgImage);
      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        time: formatLocalTime(data.timezone),
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    search(city);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search(city);
    }
  }

  useEffect(() => {
    search("Manila");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-black/30 backdrop-blur-md px-12 py-12 rounded-3xl shadow-2xl w-[450px] border border-white/10 transition-all duration-300 hover:shadow-blue-500/20">
        <div className="flex items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Search for City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-12 border-none rounded-full outline-none text-base px-6 bg-white/90 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-md"
          />
          <button
            onClick={handleSearch}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 flex-shrink-0 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <img src="/images/search.png" alt="Search" className="w-5 h-5" />
          </button>
        </div>

        {/* Weather Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/80 text-lg">Loading...</p>
          </div>
        ) : weatherData ? (
          <div className="animate-fadeIn">
            {/* Main Weather Info */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="mb-6 animate-float">
                <img src={weatherData.icon} alt="weather" className="w-32 h-32 drop-shadow-2xl" />
              </div>
              <p className="text-white text-7xl font-bold mb-2 tracking-tight">{weatherData.temperature}°C</p>
              <p className="text-white/90 text-4xl font-light tracking-wide">{weatherData.location}</p>
              <p className="text-white/90 text-2xl font-light tracking-wide">{weatherData.time}</p>
            </div>

            {/* Additional Info */}
            <div className="flex justify-around gap-8 pt-8 border-t border-white/10">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all duration-200">
                  <img src={humidity_icon} alt="humidity" className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium">Humidity</p>
                  <p className="text-white text-2xl font-semibold">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all duration-200">
                  <img src={wind_icon} alt="wind" className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium">Wind Speed</p>
                  <p className="text-white text-2xl font-semibold">{weatherData.wind} km/h</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-white/60 text-lg">Search for a city to see weather</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default Weather
