import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/dbRoutes.js';

// Express app and Port declaration
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON payloads
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/', routes);

// A basic basic 'GET' API route
app.get('/api/health', (req, res) => {
    res.json({ status: "UP", message: "Server is up and running!" });
});

// Declaration of server initialization
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server API url: http://localhost:${PORT}/api/`);
});

