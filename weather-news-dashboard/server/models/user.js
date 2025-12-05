import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Username field: required, unique, and automatically trimmed
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // Email field: required, unique, converted to lowercase, and trimmed
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Password field: required (stores the hashed password)
    password: {
        type: String,
        required: true,
    },
    // Timestamp for when the user was created
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Mongoose model from the schema.
// We use 'export default' so it can be cleanly imported as 'import User from "../models/user.js"'
const User = mongoose.model('User', UserSchema);
export default User;