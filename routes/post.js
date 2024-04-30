// Import necessary modules
const express = require('express');
const passport = require('passport');
const Post = require('../models/Post');

// Initialize Express router
const router = express.Router();

// Middleware to authenticate requests
const authenticateUser = passport.authenticate('jwt', { session: false });

// Create a new post
router.post('/posts', authenticateUser, async (req, res) => {
  try {
    const { title, body, location } = req.body;
    const createdBy = req.user.id;
    const newPost = new Post({ title, body, createdBy, location });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts of the authenticated user
router.get('/posts/nearby', authenticateUser, async (req, res) => {
    try {
      const { latitude, longitude, distance } = req.query;
  
      if (!latitude || !longitude || !distance) {
        return res.status(400).json({ message: 'Latitude, longitude, and distance are required' });
      }
  
      const posts = await Post.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(distance) * 1000 // distance in meters
          }
        }
      }).populate('createdBy');
  
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
// Update a post
router.put('/posts/:id', authenticateUser, async (req, res) => {
  try {
    const { title, body, active, location } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: { title, body, active, location } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found or user unauthorized' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a post
router.delete('/posts/:id', authenticateUser, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found or user unauthorized' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
