const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Route to get count of active and inactive posts
router.get('/postCounts', async (req, res) => {
  try {
    const activeCount = await Post.countDocuments({ active: true });
    const inactiveCount = await Post.countDocuments({ active: false });

    res.json({ activeCount, inactiveCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
