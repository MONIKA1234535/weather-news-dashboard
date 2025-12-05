import React, { useState, useEffect } from 'react';
import useWeather from "../hooks/useWeather";
import useNews from "../hooks/useNews";
import WeatherCard from "../components/WeatherCard";
import NewsList from "../components/NewsList";
import Loader from "../components/Loader"; // Assuming you need a Loader component
import { useTheme } from '../context/ThemeContext'; // Import the theme hook

// Placeholder for a simple error message component
const ErrorMessage = ({ message }) => (
    <div 
        role="alert" 
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
    >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
    </div>
);

// Assuming setView is passed as a prop from App.jsx to switch pages
export default function Dashboard({ setView }) {
    const { theme, toggleTheme } = useTheme(); // Access theme and toggle function
    
    // Start with a default city for a better first experience
    const initialCity = "Bengaluru";
    const [city, setCity] = useState(initialCity);
    const [searchQuery, setSearchQuery] = useState(initialCity);
    
    // Hooks for data fetching
    const { 
        weather, 
        getWeather, 
        loading: weatherLoading, 
        error: weatherError 
    } = useWeather();
    
    const { news, loading: newsLoading, error: newsError } = useNews(); // Assuming news hook also handles error

    // Fetch weather and news for default city on mount
    useEffect(() => {
        getWeather(city);
        // Assuming useNews fetches news automatically or you can add a fetchNews call here
    }, []); 

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            const trimmedQuery = searchQuery.trim();
            setCity(trimmedQuery);
            getWeather(trimmedQuery);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    // Determine overall loading and error states for display
    const overallLoading = weatherLoading || newsLoading;
    const overallError = weatherError || newsError;


    return (
        <div className="min-h-screen p-4 md:p-10">
            {/* Header: Title, Auth Links, and Theme Toggle */}
            <header className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b pb-4 border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4 sm:mb-0">
                    Weather & News Dashboard
                </h1>
                <div className="flex space-x-4 items-center">
                    {/* Navigation Buttons (Enhanced Styling) */}
                    <button 
                        className="text-sm px-4 py-2 border border-transparent dark:border-gray-500 rounded-lg text-indigo-600 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-150" 
                        onClick={() => setView('login')}
                    >
                        Login
                    </button>
                    <button 
                        className="text-sm px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                        onClick={() => setView('register')}
                    >
                        Register
                    </button>
                    {/* Theme Toggle (Ensuring high visibility) */}
                    <button 
                        onClick={toggleTheme} 
                        className="text-2xl p-2 rounded-full border border-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        aria-label="Toggle Dark/Light Mode"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </header>

            {/* Error Display */}
            {overallError && <ErrorMessage message={overallError} />}

            {/* Search Input (Enhanced focus styling) */}
            <div className="flex justify-center mb-10">
                <div className="flex w-full max-w-xl shadow-lg rounded-xl overflow-hidden">
                    <input
                        type="text"
                        placeholder="Enter city name (e.g., London, Mumbai)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // Added focus ring for better interactivity
                        className="p-4 w-full text-lg border-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <button
                        onClick={handleSearch}
                        // Added explicit disabled background color
                        className="px-6 py-4 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:bg-gray-500"
                        disabled={overallLoading}
                    >
                        {overallLoading ? <Loader size="small" /> : 'Search'}
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Weather Section (2/3 width on large screens) */}
                <section className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-dashed dark:border-gray-600">
                        Current Weather in {city}
                    </h2>
                    {weatherLoading ? <Loader /> : (
                        weather ? (
                            <WeatherCard weather={weather} />
                        ) : (
                            <div className="text-center p-8 border rounded-xl dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 shadow-md">
                                {/* Added background and shadow for visual pop */}
                                Enter a city to search for weather data.
                            </div>
                        )
                    )}
                </section>
                
                {/* News Section (1/3 width on large screens) */}
                <section className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-dashed dark:border-gray-600">
                        Top Headlines
                    </h2>
                    {newsLoading ? <Loader /> : (
                        news && news.length > 0 ? (
                            <NewsList news={news} />
                        ) : (
                            <div className="text-center p-8 border rounded-xl dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 shadow-md">
                                {/* Added background and shadow for visual pop */}
                                No headlines available. Check API status.
                            </div>
                        )
                    )}
                </section>
            </div>
        </div>
    );
}