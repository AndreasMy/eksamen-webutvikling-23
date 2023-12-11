const express = require('express');
const router = express.Router();

const { handleDBQuery } = require('./helpers/routerFns');
const { authenticateToken } = require('./helpers/auth');
const {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
} = require('../models/postTable');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await handleDBQuery('SELECT * FROM blog_posts');

    res.json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await handleDBQuery(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id],
      true
    );

    res.json(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/posts', authenticateToken, async (req, res) => {
  let data = req.body;
  data.username = req.user.username;

  return insertPostIntoTable(data)
    .then((id) => {
      res.status(200).json({ message: 'Post created successfully', id: id });
    })
    .catch((error) => {
      console.error('Error creating post', error);
      res
        .status(500)
        .json({ message: 'Error creating post', error: error.message });
    });
});

// Update a post
router.put('/posts/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  data.id = id;

  return updatePostIntoTable(data)
    .then((data) => {
      res
        .status(200)
        .json({ message: 'Post updated successfully', data: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Error updating post', error: error.message });
    });
});

// Delete a post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;

  return deletePostFromTable(id)
    .then((id) => {
      res.status(200).json({
        message: 'Post deleted successfully',
        id: id,
      });
    })
    .catch((error) => {
      console.error('Error deleting post', error);
      res
        .status(500)
        .json({ message: 'Error deleting post', error: error.message });
    });
});

module.exports = router;
