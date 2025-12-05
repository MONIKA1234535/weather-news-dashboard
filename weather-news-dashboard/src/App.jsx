import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { Search, MapPin, Wind, Droplet, Cloud, Sun, Sunrise, Sunset, Moon, Users, LogIn, UserPlus, Globe } from 'lucide-react';

// --- Configuration ---
// IMPORTANT: Update this if your backend server runs on a different port or domain.
const API_BASE_URL = 'http://localhost:5000/api'; 
const AUTH_API_BASE = '/auth';
const WEATHER_API_BASE = '/weather'; // Assuming your server has a /weather route
const NEWS_API_BASE = '/news'; // Assuming your server has a /news route

// --- Contexts ---

// 1. Theme Context (Handles light/dark mode)
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// 2. Auth Context (Handles login, register, token management)
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Check for stored token and user on initialization
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const authFetch = async (endpoint, body) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}${AUTH_API_BASE}${endpoint}`, body);
      
      const { token: newToken, user: userData, message } = response.data;
      
      if (newToken) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
      }
      return { success: true, message: message || 'Operation successful' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = (email, password) => authFetch('/login', { email, password });
  // Note: Registration response does not include token in authController.js, so no automatic login here.
  const register = (username, email, password) => authFetch('/register', { username, email, password });
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, authLoading, authError, login, register, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// --- Utility Components ---

const WeatherIcon = ({ iconCode, className = 'w-10 h-10' }) => {
  // Simple mapping based on typical OpenWeatherMap IDs (adjust as needed)
  if (iconCode >= 200 && iconCode < 600) return <Cloud className={className} />; // Rain/Thunder/Snow
  if (iconCode === 800) return <Sun className={className} />; // Clear
  if (iconCode > 800) return <Cloud className={className} />; // Clouds
  return <Cloud className={className} />; // Default
};

const Loader = ({ size = 6, color = 'blue-500' }) => (
  <div className={`flex justify-center items-center py-4`}>
    <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-${color}`}></div>
  </div>
);

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6 text-yellow-500" />}
        </button>
    );
};

// --- Page/Feature Components ---

const WeatherCard = ({ data, loading }) => {
  if (loading) return <Loader size={12} />;
  // Mock data structure if no real data is available
  if (!data || !data.main) return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Search for a city to see the weather.</div>;

  const { name, sys, main, weather, wind } = data;
  const description = weather[0]?.description || 'N/A';
  const iconCode = weather[0]?.id || 800;
  
  // Convert Kelvin to Celsius if API returns Kelvin (Common OpenWeatherMap behavior)
  const tempC = main.temp > 100 ? main.temp - 273.15 : main.temp;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-blue-500" />
          {name}, {sys.country}
        </h2>
        <WeatherIcon iconCode={iconCode} className="w-12 h-12 text-blue-400" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">{Math.round(tempC)}°C</p>
        <p className="text-xl capitalize text-gray-600 dark:text-gray-300 mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pressure</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{main.pressure} hPa</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 flex items-center justify-center"><Wind className="w-3 h-3 mr-1" /> Wind Speed</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{wind.speed} m/s</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 flex items-center justify-center"><Droplet className="w-3 h-3 mr-1" /> Humidity</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{main.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

const NewsCard = ({ news }) => (
  <a href={news.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-300">
    <h3 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2">{news.title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">{news.description || 'Click to read full article.'}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium flex items-center"><Globe className="w-3 h-3 mr-1"/> {news.source?.name || 'Source'}</span>
      <span className="text-xs text-gray-500 dark:text-gray-500">{new Date(news.publishedAt).toLocaleDateString()}</span>
    </div>
  </a>
);

const NewsList = ({ data, loading, error }) => {
  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 dark:text-red-400 p-4">{error}</p>;
  if (!data || data.length === 0) return <p className="text-gray-500 dark:text-gray-400 p-4">No headlines available.</p>;

  return (
    <div className="space-y-4">
      {data.map((newsItem, index) => (
        <NewsCard key={index} news={newsItem} />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [city, setCity] = useState('London'); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (searchCity) => {
    setWeatherLoading(true);
    setError(null);
    try {
      // NOTE: Your backend must implement the /weather route that fetches and proxies the weather API
      const response = await axios.get(`${API_BASE_URL}${WEATHER_API_BASE}?city=${searchCity}`);
      setWeatherData(response.data);
    } catch (err) {
      setError('Could not fetch weather data. Check city name or server setup.');
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      // NOTE: Your backend must implement the /news route that fetches and proxies the news API
      const response = await axios.get(`${API_BASE_URL}${NEWS_API_BASE}`);
      setNewsData(response.data.articles || []);
    } catch (err) {
      setError('Could not fetch news headlines. Check server setup.');
      setNewsData([]);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
    fetchNews();
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          <Cloud className="inline-block w-8 h-8 mr-2 text-blue-500" />
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">Hello, {user?.username || 'User'}!</span>
                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 shadow-md">Logout</button>
            </div>
          ) : (
             <div className="flex space-x-2">
                <button 
                    onClick={() => window.location.hash = '#login'} 
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 flex items-center shadow-md"
                >
                    <LogIn className="w-4 h-4 mr-1" /> Login
                </button>
                <button 
                    onClick={() => window.location.hash = '#register'} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 flex items-center shadow-md"
                >
                    <UserPlus className="w-4 h-4 mr-1" /> Register
                </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name for weather..."
          className="w-full max-w-lg p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition duration-150 shadow-md"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      
      {error && <p className="text-center text-red-500 mb-4 font-medium">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weather Card (Col 1 & 2) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Current Weather</h2>
          <WeatherCard data={weatherData} loading={weatherLoading} />
        </div>

        {/* News List (Col 3) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Global Headlines</h2>
          <NewsList data={newsData} loading={newsLoading} error={error} />
        </div>
      </div>
    </div>
  );
};


// --- Auth Pages (Login and Register) ---

const AuthForm = ({ title, submitText, onSubmit, loading, error, message, fields, footer }) => {
        return (
    <div className="w-full"> 
        <div className="w-full max-w-md bg-white bg-opacity-95 dark:bg-gray-900 dark:bg-opacity-95 rounded-xl shadow-2xl p-8 space-y-6 mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{title}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.label}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    ))}
                    
                    {error && <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">{error}</p>}
                    {message && <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold transition duration-150 ${
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        } flex items-center justify-center`}
                    >
                        {loading ? <Loader size={4} color="white" /> : submitText}
                    </button>
                </form>
                {footer}
            </div>
        </div>
    );
};

const Login = () => {
    const { login, authLoading, authError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const result = await login(email, password);
        if (result.success) {
            setMessage(result.message);
            setTimeout(() => { window.location.hash = '#dashboard'; }, 1000);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <AuthForm 
            title="Sign In" 
            submitText="Login"
            onSubmit={handleSubmit}
            loading={authLoading}
            error={authError}
            message={message}
            fields={[
                { label: "Email Address", type: "email", value: email, setter: setEmail },
                { label: "Password", type: "password", value: password, setter: setPassword },
            ]}
            footer={
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Don't have an account? 
                    <a href="#register" className="text-blue-600 hover:underline ml-1">Register here</a>
                </p>
            }
        />
    );
};

const Register = () => {
    const { register, authLoading, authError } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const result = await register(username, email, password);
        if (result.success) {
            setMessage(result.message + " Redirecting to login...");
             setTimeout(() => { window.location.hash = '#login'; }, 2000);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <AuthForm 
            title="Create Account" 
            submitText="Register Account"
            onSubmit={handleSubmit}
            loading={authLoading}
            error={authError}
            message={message}
            fields={[
                { label: "Username", type: "text", value: username, setter: setUsername },
                { label: "Email Address", type: "email", value: email, setter: setEmail },
                { label: "Password", type: "password", value: password, setter: setPassword },
            ]}
            footer={
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Already have an account? 
                    <a href="#login" className="text-blue-600 hover:underline ml-1">Sign In</a>
                </p>
            }
        />
    );
};


// --- Main Application Orchestrator ---

const AppContent = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        
        if (isAuthenticated && (hash === 'login' || hash === 'register' || !hash)) {
            setCurrentView('dashboard');
            window.location.hash = '#dashboard';
        } else if (hash === 'login') {
            setCurrentView('login');
           } else if (hash === 'register') {
             setCurrentView('register');
            } else if (!isAuthenticated && hash !== 'register') { 
            setCurrentView('login');
            window.location.hash = '#login';
          } else {
           setCurrentView('dashboard');
          }
// ...
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  let ComponentToRender;
  if (currentView === 'login') {
    ComponentToRender = Login;
  } else if (currentView === 'register') {
    ComponentToRender = Register;
  } else {
    ComponentToRender = Dashboard;
  }
  
  return (
    <div className="min-h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ComponentToRender />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;