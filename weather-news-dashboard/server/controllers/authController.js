import User from '../models/user.js'; // Imports the User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// IMPORTANT: Replace this with an environment variable (process.env.JWT_SECRET) in production.
const JWT_SECRET = 'your_super_secret_key_123'; 

// --- Registration Logic ---
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Respond with success message
        res.status(201).json({ 
            message: 'Registration successful. Proceed to login.',
            user: { username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// --- Login Logic ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with token
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};