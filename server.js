require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongodb = require('./data/database');
const professionalRoutes = require('./routes/professional');
const videosRoutes = require('./routes/videos');    

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve professional API
app.use('/professional', professionalRoutes);
app.use('/videos', videosRoutes);

// serve frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// backend routes
app.use('/', require('./routes'));

app.get('/', (req, res) => {
  res.send('Backend API is up. Try GET /professional');
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node is running on http://localhost:${port}`);
    });
  }
});
