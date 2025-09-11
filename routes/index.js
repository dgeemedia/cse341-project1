// routes/index.js - mounts API route groups
const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// If you have a /users route file, keep it (optional)
router.use('/users', require('./users'));

// Contacts endpoint
router.use('/contacts', require('./contacts'));

module.exports = router;
