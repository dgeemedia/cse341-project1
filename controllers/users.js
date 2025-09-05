// controllers/users.js
const db = require('../data/database');
const { ObjectId } = require('mongodb');

async function getAllUsers(req, res) {
  try {
    const database = db.getDb(); // returns the connected DB instance (or throws if not initialized)
    const users = await database.collection('users').find({}).toArray();
    return res.status(200).json(users);
  } catch (err) {
    console.error('getAllUsers error:', err);
    // If DB not initialized, give 503; otherwise 500
    if (err.message && err.message.includes('not initialized')) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    return res.status(500).json({ error: 'Unable to fetch users' });
  }
}

async function getUserById(req, res) {
  try {
    const database = db.getDb();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await database.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    if (err.message && err.message.includes('not initialized')) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    return res.status(500).json({ error: 'Unable to fetch user' });
  }
}

module.exports = {
  getAllUsers,
  getUserById
};
