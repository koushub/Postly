const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Define the route and inject the middleware
router.post('/upload', uploadMiddleware.single('image'), uploadController.uploadImage);

module.exports = router;