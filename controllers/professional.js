const fs = require('fs');
const path = require('path');
const db = require('../data/database'); // native driver helper (initDb/getDb)

// fallback file (only professional.json now)
const fallbackPath = path.join(process.cwd(), 'professional.json');

async function readFallback() {
  if (fs.existsSync(fallbackPath)) {
    try {
      const raw = fs.readFileSync(fallbackPath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Failed to parse fallback file:', err.message);
    }
  }
  throw new Error('No fallback professional.json file found or parseable');
}

async function fetchVideosFromDb() {
  try {
    const database = db.getDb();
    const rows = await database
      .collection('videos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return rows.map(r => ({
      _id: r._id,
      videoLink: r.videoLink,
      videoId: r.videoId,
      title: r.title,
      description: r.description,
      createdAt: r.createdAt
    }));
  } catch (err) {
    console.warn('Could not fetch videos from DB:', err.message);
    return [];
  }
}

async function getProfessional(req, res) {
  let data = null;

  // fallback to file if DB not used
  try {
    data = await readFallback();
  } catch (err) {
    console.error('Failed to read professional.json:', err.message);
    return res.status(500).json({ error: 'Unable to fetch professional data' });
  }

  try {
    const videos = await fetchVideosFromDb();
    data.videos = videos;

    if (videos && videos.length > 0) {
      const newest = videos[0];
      data.linkedInLink = {
        text: 'YouTube',
        link: newest.videoLink || `https://www.youtube.com/watch?v=${newest.videoId}`
      };
    } else {
      if (!data.linkedInLink) {
        data.linkedInLink = { text: 'YouTube', link: '' };
      }
    }
  } catch (_) {}

  return res.json(data);
}

module.exports = { getProfessional };
