import { useState, useEffect } from "react";
import useWeather from "../hooks/useWeather";
import useNews from "../hooks/useNews";
import WeatherCard from "../components/WeatherCard"; // <-- New Import
import NewsList from "../components/NewsList";     // <-- New Import

export default function Dashboard() {
  // Start with a default city for a better first experience
  const initialCity = "Bengaluru";
  const [city, setCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(initialCity);
  
  // Renaming loading/error variables for clarity
  const { 
    weather, 
    getWeather, 
    loading: weatherLoading, 
    error: weatherError 
  } = useWeather();
  
  const { news, loading: newsLoading } = useNews();

  // Fetch weather for default city on mount
  useEffect(() => {
    getWeather(city);
  }, []); 

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setCity(searchQuery.trim());
      getWeather(searchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <div className="dashboard-container">

      <h1>Weather & News Dashboard</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="content-grid">
        {/* Weather Section */}
        <div className="weather-section">
          <h2>Current Weather in {city}</h2>
          <WeatherCard 
            weather={weather} 
            loading={weatherLoading} 
            error={weatherError} 
          />
        </div>

        {/* News Section */}
        <div className="news-section">
          <h2>Top Headlines (India)</h2>
          <NewsList 
            news={news} 
            loading={newsLoading} 
          />
        </div>
      </div>
    </div>
  );
}