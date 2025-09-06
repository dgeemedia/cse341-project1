// scripts/seed.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../data/database');

const fallbackPath = path.join(process.cwd(), 'professional.json');

async function seed() {
  try {
    await db.initDb();
    const database = db.getDb();
    console.log('Connected to MongoDB for seeding.');

    // read professional.json
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    } catch (err) {
      console.error('Failed to read or parse professional.json:', err.message);
      return process.exit(1);
    }

    const collection = database.collection('professionals');

    const existing = await collection.findOne({});
    if (existing && existing._id) {
      await collection.replaceOne({ _id: existing._id }, data, { upsert: true });
      console.log('Existing professional document replaced with professional.json contents.');
    } else {
      await collection.insertOne(data);
      console.log('Seeded one Professional document from professional.json');
    }

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
