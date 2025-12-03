// Import the necessary constructors directly from the Mongoose module,
// which is the most reliable way in modern ESM Node environments.
import { Schema, model } from 'mongoose';

// The Schema constructor is now available directly.
const searchSchema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  lat: {
    type: Number,
    required: false,
  },
  lon: {
    type: Number,
    required: false,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  }
});

// Use the directly imported 'model' function.
export default model('Search', searchSchema);