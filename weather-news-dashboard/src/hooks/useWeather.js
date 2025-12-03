import { useState } from "react";
// Import BACKEND_BASE instead of WEATHER_BASE
import { BACKEND_BASE } from "../utils/api"; 

export default function useWeather() {
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const getWeather = async (city) => {
try {
setLoading(true);
setError(null);

  // *** CHANGE: Use the backend base URL and the proxy path ***
  // The API key and units are now handled securely by the Node.js server.
  const url = `${BACKEND_BASE}/api/weather?city=${city}`; 
  console.log("Weather URL (Proxy):", url);

  const res = await fetch(url);
  const data = await res.json();

  // Check for 400 or non-200 codes returned by the proxy
  if (data.cod !== 200) setError(data.message || "City not found or API error.");
  else setWeather(data);

} catch {
  // General network error (e.g., server not running)
  setError("Error connecting to dashboard server on port 5000.");
} finally {
  setLoading(false);
}

};

return { weather, loading, error, getWeather };
}