// controllers/videos.js
const db = require('../data/database');

/**
 * listVideos - GET /videos
 * returns array of videos sorted by createdAt desc
 */
async function listVideos(req, res) {
  try {
    const database = db.getDb();
    const videos = await database.collection('videos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(videos);
  } catch (err) {
    console.error('listVideos error:', err.message || err);
    return res.status(500).json({ error: 'Unable to fetch videos' });
  }
}

/**
 * createVideo - POST /videos
 * Accepts body { videoLink, title, description }
 * Will attempt to extract videoId from the watch URL (or accept provided videoId)
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  // common patterns:
  // https://www.youtube.com/watch?v=VIDEOID
  // https://youtu.be/VIDEOID
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }
  } catch (_) {
    // fallback regex
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}

async function createVideo(req, res) {
  try {
    const { videoLink, title, description, videoId: providedId } = req.body || {};
    if (!videoLink && !providedId) {
      return res.status(400).json({ error: 'videoLink or videoId required' });
    }

    const videoId = providedId || extractYouTubeId(videoLink);
    if (!videoId) return res.status(400).json({ error: 'Could not extract YouTube videoId' });

    const doc = {
      videoLink: videoLink || `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
      title: title || null,
      description: description || null,
      createdAt: new Date()
    };

    const database = db.getDb();
    const result = await database.collection('videos').insertOne(doc);
    return res.status(201).json({ insertedId: result.insertedId, ...doc });
  } catch (err) {
    console.error('createVideo error:', err.message || err);
    return res.status(500).json({ error: 'Failed to create video' });
  }
}

module.exports = { listVideos, createVideo };
