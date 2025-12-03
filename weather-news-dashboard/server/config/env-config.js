import 'dotenv/config'; // Load environment variables once

// Ensure the variables are accessible, even if they were renamed 
// (e.g., if you switched from NEWS_API_KEY to GNEWS_API_KEY)
export const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.GNEWS_API_KEY; 
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Log a warning if the news key is missing (for debugging)
if (!NEWS_API_KEY) {
    console.warn("CRITICAL WARNING: The NEWS_API_KEY is not set in server/.env!");
} else {
    // New debug message: Confirm that the server loaded a value for the key
    const maskedKey = NEWS_API_KEY.substring(0, 5) + '...';
    console.log(`DEBUG: News API Key loaded. Starts with: ${maskedKey}`);
}