// Route: backend/routes/professional.js
// This route handles GET requests to /professional and returns the professional JSON data from the database or fallback file

const express = require('express');
const router = express.Router();
const { getProfessional } = require('../controllers/professional');

// GET /professional -> returns the professional JSON expected by the frontend
router.get('/', getProfessional);

module.exports = router;
