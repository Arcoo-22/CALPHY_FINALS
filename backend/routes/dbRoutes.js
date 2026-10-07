import express from 'express';
import dbController from '../controllers/dbControllers.js';
const router = express.Router();

// POST /api/register - Register a new user
router.post('/register', dbController.registerUser);

// POST /api/login - Login a user
router.post('/login', dbController.loginUser);

// POST /api/verify-token - Verify a user token
router.post('/verify-token', dbController.verifyToken);

// GET /api/user-progress/:id - Get user progress by user ID
router.get('/user-progress/:id', dbController.getUserProgress);

// PUT /api/user-progress/:id - Update user progress by user ID
router.put('/user-progress/:id', dbController.updateUserProgress);

// GET /api/user/:username - Get user by username
router.get('/user/:username', dbController.getUserByName);

// POST /api/set-token - Set user token
router.post('/set-token', dbController.setToken);

router.get('/all/', dbController.getAllUsers);
export default router;