//data/database.js
const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database);
  }
    MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db();
      console.log('Database initialized!');
      return callback(null, database);
    })
    .catch((err) => {
      console.log('Database initialization failed!');
      return callback(err);
    });
};

const getDb = () => {
  if (!database) {
    throw Error('Database not initialized!');
  }
  return database;
};

module.exports = {
  initDb,
  getDb
};