//server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');  
const path = require('path');
const cors = require('cors');
const mongodb = require('./data/database');
const professionalRoutes = require('./routes/professional');
const videosRoutes = require('./routes/videos');    

/* ===== swagger loader (near top) ===== */
const swaggerUi = require('swagger-ui-express');
let swaggerDocument;
try {
  swaggerDocument = require('./swagger.json');
} catch (err) {
  swaggerDocument = null;
}
/* ===== end swagger loader ===== */

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
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.send('Backend API is up. Try GET /professional');
});

if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.warn('swagger.json not found — create it (see project instructions) to enable /api-docs');
}

/* Generic error handler (clean) */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

/* Start only after DB initialized */
mongodb.initDb((err) => {
  if (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`App listening on http://localhost:${port}`);
      console.log(`API docs (if present): http://localhost:${port}/api-docs`);
    });
  }
});
