import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/dbRoutes.js';
import cookieParser from 'cookie-parser';
import crypto from 'crypto'; 

// Express app and Port declaration
const app = express();
const PORT = 3000;


// Middleware to parse incoming JSON payloads
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', routes);

// A basic basic 'GET' API route
app.get('/api/health', (req, res) => {
    res.json({ status: "UP", message: "Server is up and running!" });
});

// Route to set a cookie with a unique ID, only use on login or registration
app.get('/set-user-cookie', (req, res) => {
  // Generate a unique ID for the user
  const uniqueUserId = crypto.randomUUID();

  // Set the cookie with the unique ID
  res.cookie('user_session_id', uniqueUserId, {
    httpOnly: true, // Prevents client-side JS access (security)
    secure: true,   // Only sends over HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours
    sameSite: 'Strict' // Prevents CSRF attacks
  });

  res.send(`Cookie set with unique ID: ${uniqueUserId}`);
});

// Declaration of server initialization
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server API url: http://localhost:${PORT}/api/`);
});

