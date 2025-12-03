import { useState, useEffect } from "react";
import { BACKEND_BASE } from "../utils/api";

/**
 * Custom hook to fetch and manage top news headlines using the backend proxy.
 * It automatically fetches news on component mount.
 * @returns {object} { news, loading, error }
 */
export default function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);
        
        // Use the proxy endpoint defined in your backend
        const url = `${BACKEND_BASE}/api/news`;
        console.log("News URL (Proxy):", url);

        const res = await fetch(url);
        
        // Check for network errors (e.g., 404, 500 from the proxy itself)
        if (!res.ok) {
            console.error(`Proxy HTTP Error: ${res.status}`);
            throw new Error(`Proxy server error: Status ${res.status}`);
        }
        
        const data = await res.json();

        // The proxy should return an array of articles, or an error object if the upstream News API failed.
        if (data.status === 'error' || data.error) {
            console.error("News API Error via Proxy:", data.message || data.error);
            setError(data.message || 'Error fetching news headlines via proxy.');
            setNews([]);
        } else {
            // News articles are typically in the 'articles' field, but some proxies might return the array directly.
            setNews(data.articles || data || []); 
        }
      } catch (e) {
        console.error("News fetch exception:", e);
        // General network error (e.g., server not running)
        setError("Error connecting to dashboard server on port 5000 for news.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []); // Runs once on mount

  return { news, loading, error };
}