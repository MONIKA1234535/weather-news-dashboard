import express from 'express';
// We use named imports for register and login, assuming authController uses named exports.
import { register, login } from '../controllers/authController.js'; 

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// Use export default for the router instance
export default router;