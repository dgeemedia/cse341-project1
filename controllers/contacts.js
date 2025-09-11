const db = require('../data/database');
const { ObjectId } = require('mongodb');

async function getAllUsers(req, res) {
  try {
    const database = db.getDb();
    const users = await database.collection('users').find({}).toArray();
    return res.status(200).json(users);
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

async function createUser(req, res) {
  try {
    const database = db.getDb();
    const newUser = req.body;
    // Optional: basic validation, e.g. require a name or email
    // if (!newUser.name) return res.status(400).json({ error: 'Name is required' });

    const result = await database.collection('users').insertOne(newUser);
    // insertOne no longer returns ops in modern drivers; use insertedId.
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
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // Clone and sanitize body
    const updatedUser = { ...req.body };
    if (updatedUser._id) delete updatedUser._id; // never allow changing _id

    // Reject empty updates (prevents passing an empty $set to MongoDB)
    if (Object.keys(updatedUser).length === 0) {
      return res.status(400).json({ error: 'Request body is empty — include fields to update' });
    }

    // Driver compatibility: mongodb v4 uses returnDocument, older drivers use returnOriginal.
    const options = { returnDocument: 'after' }; // if this errors, change to { returnOriginal: false }

    const result = await database.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedUser },
      options
    );

    if (!result.value) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(result.value);
  } catch (err) {
    console.error('updateUser error:', err);
    // Helpful user-facing message for common errors
    if (err.message && (err.message.includes('returnDocument') || err.message.includes('returnOriginal'))) {
      return res.status(500).json({ error: 'Server driver mismatch: update options incompatible with installed mongodb driver' });
    }
    return res.status(500).json({ error: 'Unable to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const database = db.getDb();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const result = await database.collection('users').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
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
