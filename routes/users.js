//routes/users.js
const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

// Route to get all users
router.get('/', usersController.getAllUsers);

// Route to get a user by ID
router.get('/:id', usersController.getUserById);

module.exports = router;