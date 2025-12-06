// src/hooks/useNews.js (REVISED)

import { useState, useEffect } from "react";
import { BACKEND_BASE } from "../utils/api";

/**
 * Custom hook to fetch and manage top news headlines using the backend proxy.
 * @param {string} city - The city name to search for news.
 * @returns {object} { news, loading, error }
 */
export default function useNews(city) { // 👈 Accept 'city' as parameter
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchNews() {
  try {
  setLoading(true);
    setError(null);
    // Pass the city name as a query parameter in the URL
    const url = `${BACKEND_BASE}/api/news?city=${city || 'Global'}`; // Default to 'Global' or a default keyword
    const res = await fetch(url);
    // ... rest of the fetch and error handling logic ...
    if (!res.ok) {
    throw new Error(`Proxy server error: Status ${res.status}`);
      }
    const data = await res.json();

    if (data.status === 'error' || data.error) {
    setError(data.message || 'Error fetching news headlines via proxy.');
    setNews([]);
    } else {
    setNews(data.articles || data || []); 
    }
    } catch (e) {
    setError("Error connecting to dashboard server for news.");
    setNews([]);
  } finally {
    setLoading(false);
    }
    }
    fetchNews();
    }, [city]); // 👈 CRITICAL: Re-run the effect whenever the 'city' changes

    return { news, loading, error };
  }