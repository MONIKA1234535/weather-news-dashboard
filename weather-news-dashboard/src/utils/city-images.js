/**
 * Maps city names (or country names) to placeholder image URLs 
 * of iconic landmarks for visual appeal.
 * NOTE: These are placeholder URLs for demonstration purposes. 
 * In a real application, you would host these images or use an API.
 */
const CITY_IMAGES = {
  // India
  'bengaluru': 'https://placehold.co/400x300/104f7f/ffffff?text=Bangalore+Palace',
  'mumbai': 'https://placehold.co/400x300/4c4a4e/ffffff?text=Gateway+of+India',
  'delhi': 'https://placehold.co/400x300/c72020/ffffff?text=Red+Fort+Delhi',
  'chennai': 'https://placehold.co/400x300/7a7019/ffffff?text=Marina+Beach',
  'kolkata': 'https://placehold.co/400x300/3e4559/ffffff?text=Victoria+Memorial',
  
  // International
  'new york': 'https://placehold.co/400x300/494669/ffffff?text=Statue+of+Liberty',
  'london': 'https://placehold.co/400x300/0d522f/ffffff?text=Big+Ben+Clock',
  'tokyo': 'https://placehold.co/400x300/a80000/ffffff?text=Tokyo+Skytree',
  'paris': 'https://placehold.co/400x300/966427/ffffff?text=Eiffel+Tower',
  'sydney': 'https://placehold.co/400x300/1f7a8c/ffffff?text=Sydney+Opera+House',
  
  // Default fallback image
  'default': 'https://placehold.co/400x300/222222/ffffff?text=Global+Cityscape',
};

// Function to get the image URL based on the city name
export const getCityImage = (city) => {
  if (!city) return CITY_IMAGES.default;
  
  // Normalize the city name for matching (lowercase, no leading/trailing spaces)
  const normalizedCity = city.toLowerCase().trim();
  
  // Check for exact match first
  if (CITY_IMAGES[normalizedCity]) {
    return CITY_IMAGES[normalizedCity];
  }
  
  // Fallback to default if no match is found
  return CITY_IMAGES.default;
};