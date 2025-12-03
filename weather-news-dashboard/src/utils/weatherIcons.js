// Utility function to map OpenWeatherMap icon codes to a generic, styled icon class or emoji.
// For a production app, you would typically use a library like 'react-icons' or fetch the actual OWM icon image.

export function getWeatherIcon(iconCode) {
  // Mapping based on common OpenWeatherMap icons (d=day, n=night)
  const map = {
    // Clear
    '01d': '☀️', // Clear sky (day)
    '01n': '🌙', // Clear sky (night)
    
    // Clouds
    '02d': '🌤️', // Few clouds (day)
    '02n': '☁️', // Few clouds (night)
    '03d': '☁️', // Scattered clouds
    '03n': '☁️',
    '04d': ' overcast_cloud ', // Broken clouds / Overcast
    '04n': ' overcast_cloud ', 

    // Rain
    '09d': '🌧️', // Shower rain
    '09n': '🌧️',
    '10d': '🌦️', // Rain
    '10n': '🌧️',
    
    // Thunderstorm
    '11d': '⛈️', 
    '11n': '⛈️',
    
    // Snow
    '13d': '❄️', 
    '13n': '❄️',
    
    // Atmosphere
    '50d': '🌫️', // Mist
    '50n': '🌫️',
  };
  
  return map[iconCode] || '❓';
}