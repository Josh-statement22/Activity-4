import { useState } from 'react';
import axios from 'axios';
import { Sun, CloudRain, Cloud, Snowflake, Wind, MapPin } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:3000/weather?city=${city}`);
      setWeather(res.data.data);
    } catch (err) {
      setError('Could not fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // 🌦 Helper: Choose icon based on weather condition
  const getWeatherIcon = (condition) => {
    const desc = condition?.toLowerCase() || '';
    if (desc.includes('rain')) return <CloudRain className="text-blue-500" size={60} />;
    if (desc.includes('cloud')) return <Cloud className="text-gray-500" size={60} />;
    if (desc.includes('clear')) return <Sun className="text-yellow-400" size={60} />;
    if (desc.includes('snow')) return <Snowflake className="text-blue-300" size={60} />;
    return <Wind className="text-gray-400" size={60} />;
  };

  // 🎨 Helper: Dynamic background color based on weather
  const getWeatherBackground = (condition) => {
    switch (condition) {
      case 'Clear':
        return 'from-yellow-200 via-yellow-300 to-yellow-500';
      case 'Clouds':
        return 'from-gray-200 via-gray-300 to-gray-500';
      case 'Rain':
        return 'from-blue-300 via-blue-500 to-blue-700';
      case 'Thunderstorm':
        return 'from-gray-700 via-gray-900 to-black';
      case 'Drizzle':
        return 'from-blue-200 via-blue-400 to-blue-600';
      case 'Snow':
        return 'from-blue-100 via-blue-200 to-white';
      default:
        return 'from-sky-300 via-blue-200 to-blue-400';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-700 bg-gradient-to-b ${
        weather
          ? getWeatherBackground(weather.weather[0].main)
          : 'from-sky-300 via-blue-200 to-blue-400'
      }`}
    >
      {/* Subtle floating background circles for aesthetic depth */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">
        Weather <span className="text-yellow-300">Lang</span> 
      </h1>

      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-blue-600" size={22} />
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 bg-white/80"
          />
        </div>
        <button
          onClick={handleSearch}
          className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg w-full hover:from-blue-700 hover:to-blue-600 transition-transform transform hover:scale-[1.02] ${
            loading && 'opacity-70 cursor-not-allowed'
          }`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>

        {error && <p className="text-red-500 mt-4 animate-fadeIn">{error}</p>}

        {weather && (
          <div className="mt-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-fadeIn transform transition-all hover:scale-[1.01]">
            <div className="flex flex-col items-center gap-3">
              {getWeatherIcon(weather.weather[0].main)}
              <h2 className="text-2xl font-bold text-gray-800 mt-2">{weather.name}</h2>
              <p className="text-gray-700 text-lg font-medium">
                🌡 {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-gray-600 capitalize tracking-wide">
                {weather.weather[0].description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
