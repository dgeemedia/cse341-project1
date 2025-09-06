// routes/videos.js
const express = require('express');
const router = express.Router();
const videosController = require('../controllers/videos');

// GET /videos  -> list videos
router.get('/', videosController.listVideos);

// POST /videos -> create a video
router.post('/', videosController.createVideo);

module.exports = router;
