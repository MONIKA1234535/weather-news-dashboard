import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Login({ setView, onLoginSuccess }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isDarkMode = theme === 'dark';
    const cardClasses = isDarkMode 
        ? 'bg-gray-900 bg-opacity-90 border-gray-700 shadow-2xl' // Increased opacity and darker BG for dark mode
        : 'bg-white bg-opacity-90 border-gray-200 shadow-xl'; // Increased opacity for light mode
    const inputClasses = isDarkMode 
        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-indigo-500' 
        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-indigo-600';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const backendUrl = 'http://localhost:5000/api/auth/login'; 

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                onLoginSuccess(); 
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error("Network or API error:", err);
            setError('Could not connect to the authentication server (Is the Node.js server running?).');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 transition-all duration-500 weather-hero-background">

            <img 
                src="https://source.unsplash.com/random/1920x1080/?weather,news,city" 
                alt="Weather and News Background" 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            />
            

            {/* Overlay to ensure form readability over the background image */}
            <div className="absolute inset-0 bg-black opacity-60"></div> 

            <div className="relative z-10 w-full max-w-md">
                <AuthForm 
                    title="Sign In to Dashboard" 
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
                        <p className="text-center text-white dark:text-gray-400">
                            Don't have an account? 
                            <a href="#register" className="text-blue-400 hover:underline ml-1">Register here</a>
                        </p>
                    }
                />
            </div>
        </div>
    );
}