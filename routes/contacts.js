// routes/contacts.js
const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// GET /contacts
router.get('/', contactsController.getAllUsers);

// GET /contacts/:id
router.get('/:id', contactsController.getUserById);

// POST /contacts
router.post('/', contactsController.createUser);

// PUT /contacts/:id
router.put('/:id', contactsController.updateUser);

// DELETE /contacts/:id
router.delete('/:id', contactsController.deleteUser);

module.exports = router;
