require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Allow React Frontend

// Register Routes
// Note: We mount them under different paths for clarity
app.use('/auth', authRoutes);    // e.g., http://localhost:3000/auth/forgot-password
app.use('/storage', uploadRoutes); // e.g., http://localhost:3000/storage/upload

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node Service running on port ${PORT}`);
});