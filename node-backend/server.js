require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();

// Global Middleware
app.use(express.json());
// Allow access from Env Variable or Localhost
app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173' 
}));

// Auth and upload Routes
app.use('/auth', authRoutes);
app.use('/storage', uploadRoutes);

// Dynamic Port so we Use Render's port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node Service running on port ${PORT}`);
});