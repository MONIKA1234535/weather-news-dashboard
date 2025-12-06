// src/routes/newsRoutes.js (Revised)

import * as expressModule from 'express';
import { default as fetch } from 'node-fetch';

const express = expressModule.default || expressModule;
const router = express.Router();
const NEWS_BASE = "https://newsapi.org/v2";

// 💡 THE FIX IS HERE: Use VITE_NEWS_KEY as defined in your .env
const API_KEY = process.env.NEWS_API_KEY; 

router.get('/', async (req, res) => {
  // Check if the key is missing before making the call
 if (!API_KEY) {
 console.error('News API Key is missing. Check .env file and server setup.');
 return res.status(500).json({ message: 'News API Key not configured on server.' });
 }

 // Change country=in to country=us (United States) for a reliable test
const url = `${NEWS_BASE}/top-headlines?country=us&apiKey=${API_KEY}`;
 try {
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'error') {
      // News API returns status: 'error' if the key is invalid or request is malformed
      console.error('News API responded with an error:', data.message);
   throw new Error(data.message);
 }
  res.json(data);
 } catch (error) {
 console.error('News Proxy Error:', error.message);
 res.status(500).json({ message: 'Failed to fetch news data from external API.' });
 }
});

export default router;