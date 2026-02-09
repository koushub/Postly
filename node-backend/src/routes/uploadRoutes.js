const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/upload', uploadMiddleware.single('image'), uploadController.uploadImage);

module.exports = router;