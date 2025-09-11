// controllers/contacts.js
// Copy this file to controllers/contacts.js
const db = require('../data/database');
const { ObjectId } = require('mongodb');

// Helper for consistent collection name used by routes (/contacts)
const COLLECTION = 'contacts';

async function getAllUsers(req, res) {
  try {
    const database = db.getDb();
    const docs = await database.collection(COLLECTION).find({}).toArray();
    return res.status(200).json(docs);
  } catch (err) {
    console.error('getAllUsers error:', err);
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
    console.log('getUserById id:', id);
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid user id' });

    const user = await database.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
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

async function createUser(req, res) {
  try {
    const database = db.getDb();
    const newUser = req.body;
    console.log('createUser body:', newUser);

    if (!newUser || Object.keys(newUser).length === 0) {
      return res.status(400).json({ error: 'Request body required' });
    }

    if (newUser._id) delete newUser._id;

    const result = await database.collection(COLLECTION).insertOne(newUser);
    console.log('createUser result:', result);

    const createdUser = { _id: result.insertedId, ...newUser };
    return res.status(201).json(createdUser);
  } catch (err) {
    console.error('createUser error:', err);
    if (err.message && err.message.includes('not initialized')) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    return res.status(500).json({ error: 'Unable to create user' });
  }
}

async function updateUser(req, res) {
  try {
    const database = db.getDb();
    const id = req.params.id;
    console.log('updateUser id:', id);
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid user id' });

    const updatedUser = { ...req.body };
    console.log('updateUser body:', updatedUser);
    if (updatedUser._id) delete updatedUser._id;

    if (Object.keys(updatedUser).length === 0) {
      return res.status(400).json({ error: 'Request body is empty — include fields to update' });
    }

    // Try modern option first; fallback to older option name if needed
    let options = { returnDocument: 'after' }; // v4+
    let result;
    try {
      result = await database.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        options
      );
    } catch (innerErr) {
      console.warn('findOneAndUpdate first attempt failed, trying fallback option:', innerErr.message);
      // fallback option name for older drivers
      options = { returnOriginal: false };
      result = await database.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        options
      );
    }

    console.log('findOneAndUpdate result:', result);

    if (!result || !result.value) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(result.value);
  } catch (err) {
    console.error('updateUser error:', err);
    if (err.message && err.message.includes('not initialized')) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    return res.status(500).json({ error: 'Unable to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const database = db.getDb();
    const id = req.params.id;
    console.log('deleteUser id:', id);
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid user id' });

    const result = await database.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    console.log('deleteUser result:', result);
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

    return res.status(204).send();
  } catch (err) {
    console.error('deleteUser error:', err);
    if (err.message && err.message.includes('not initialized')) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    return res.status(500).json({ error: 'Unable to delete user' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
