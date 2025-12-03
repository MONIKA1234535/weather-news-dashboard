import * as expressModule from 'express'; // Use wildcard import for Express
import fetch from 'node-fetch'; 
import Search from '../models/Search.js'; 

// FIX: Ensure 'express' variable is correctly initialized for ESM compatibility
const express = expressModule.default || expressModule;

const router = express.Router(); // This line now uses the fixed 'express' variable
const WEATHER_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/', async (req, res) => {
  const { city, lat, lon } = req.query;

  let url = `${WEATHER_BASE}/weather?units=metric&appid=${API_KEY}`;
  
  if (city) {
    url += `&q=${city}`;
  } else if (lat && lon) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    return res.status(400).json({ message: "City or coordinates (lat, lon) required." });
  }

  try {
    const newSearch = new Search({ 
        city: city || 'Geolocation Lookup',
        lat: lat, 
        lon: lon 
    });
    await newSearch.save();
    console.log(`Search logged: ${city || `${lat}, ${lon}`}`);

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error('Weather Proxy Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data from external API.' });
  }
});

export default router;