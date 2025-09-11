//routes/index.js
const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

router.use('/users', require('./users'));
router.use('/contacts', require('./contacts')); 

module.exports = router;
