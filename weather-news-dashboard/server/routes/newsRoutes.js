import * as expressModule from 'express'; // Use wildcard import for Express
import fetch from 'node-fetch';

// FIX: Ensure 'express' variable is correctly initialized for ESM compatibility
const express = expressModule.default || expressModule;

const router = express.Router(); // This line now uses the fixed 'express' variable
const NEWS_BASE = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY;

router.get('/', async (req, res) => {
  const url = `${NEWS_BASE}/top-headlines?country=in&apiKey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'error') {
        throw new Error(data.message);
    }
    
    res.json(data);
  } catch (error) {
    console.error('News Proxy Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch news data from external API.' });
  }
});

export default router;