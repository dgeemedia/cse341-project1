const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts'); // file we provide below

// GET all contacts
router.get('/', contactsController.getAllUsers);

// GET contact by id
router.get('/:id', contactsController.getUserById);

// POST create new contact
router.post('/', contactsController.createUser);

// PUT update contact
router.put('/:id', contactsController.updateUser);

// DELETE contact
router.delete('/:id', contactsController.deleteUser);

module.exports = router;
