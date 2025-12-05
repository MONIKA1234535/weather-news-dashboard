import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Register({ setView }) {
    // 1. Theme and State Management
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 2. Dynamic Class Calculation
    const isDarkMode = theme === 'dark';
    const cardClasses = isDarkMode 
        ? 'bg-gray-800 border-gray-700 shadow-2xl' 
        : 'bg-white border-gray-200 shadow-xl';
    const inputClasses = isDarkMode 
        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-green-500' 
        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-green-600';

    // 3. Registration Handler
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        
        // Target the Node.js backend endpoint for user registration
        const backendUrl = 'http://localhost:5000/api/auth/register'; 

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Registration successful! Redirecting to login...');
                // Automatically switch to the Login view after a delay
                setTimeout(() => setView('login'), 2500); 
            } else {
                setError(data.message || 'Registration failed. Please check the form data.');
            }
        } catch (err) {
            console.error("Network or API error:", err);
            setError('Could not connect to the authentication server (Is the Node.js server running?).');
        } finally {
            setIsLoading(false);
        }
    };
// pages/Register.jsx

// ... (Rest of the component code remains the same)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full"> 
            <div className={`w-full max-w-md p-8 rounded-2xl border ${cardClasses}`}>
              <h2 className="text-3xl font-extrabold text-center mb-6 text-green-600 dark:text-green-400">
                    📝 Create Account
                </h2>
                {/* ... (Form content remains the same) */}

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* ... (Input fields and button remain the same) */}
                </form>

                {/* --- ADDED: Link to Sign In Page --- */}
                <p className="mt-8 text-center text-sm dark:text-gray-400">
                    Already have an account?{' '}
                    <button 
                        onClick={() => setView('login')} // Use setView to switch to login
                        className="font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition focus:outline-none"
                    >
                        Sign In
                    </button>
                </p>
                {/* ---------------------------------- */}
            </div>
        </div>
    );
}
