import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

export default function WeatherCard({ weather, loading, error }) {
  if (loading) {
    return <div className="weather-card loading">Loading weather data...</div>;
  }

  if (error) {
    // Note: The OpenWeatherMap API key error is handled here.
    return <div className="weather-card error-state">Error: {error}</div>;
  }

  if (!weather) {
    return <div className="weather-card initial-state">Search for a city to see the weather.</div>;
  }

  // Destructure data for cleaner access
  const { 
    name, 
    main: { temp, temp_min, temp_max, humidity }, 
    weather: [details],
    wind: { speed },
    sys: { country }
  } = weather;

  const icon = getWeatherIcon(details.icon);
  const description = details.description.charAt(0).toUpperCase() + details.description.slice(1);

  return (
    <div className="weather-card">
      <div className="city-header">
        <h3 className="city-name">{name}, {country}</h3>
        <span className="weather-icon">{icon}</span>
      </div>
      
      <div className="temperature-section">
        <p className="current-temp">{Math.round(temp)}°C</p>
        <p className="description">{description}</p>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <span className="label">High / Low</span>
          <span className="value">{Math.round(temp_max)}° / {Math.round(temp_min)}°</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed</span>
          <span className="value">{speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity</span>
          <span className="value">{humidity}%</span>
        </div>
      </div>
    </div>
  );
}