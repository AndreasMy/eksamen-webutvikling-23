const express = require('express');
const router = express.Router();

const {
  handleDBQuery,
  getPostsAndUsernames,
} = require('../helpers/routerFns');
const { authenticateToken, verifyPostAuthor } = require('../helpers/auth');
const {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
} = require('../models/postTable');
const { handleResponse } = require('../helpers/errorHandler');

// Get all posts
router.get('/posts', async (req, res, next) => {
  try {
    const postsWithUsernames = await getPostsAndUsernames();
    res.json(postsWithUsernames);
  } catch (error) {
    console.error('Error selecting posts', error);
    next(error);
  }
});

// Get a post by ID
router.get('/posts/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await handleDBQuery(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id],
      true
    );
    res.json(post);
  } catch (error) {
    console.error('Error selecting post', error);
    next(error);
  }
});

router.post('/posts', authenticateToken, async (req, res, next) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    await insertPostIntoTable(data);
    return handleResponse(res, 200, 'Post created successfully');
  } catch (error) {
    console.error('Error creating post', error);
    next(error);
  }
});

// Update a post
router.put(
  '/posts/:id',
  authenticateToken,
  verifyPostAuthor,
  async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        id: req.params.id,
        username: req.user.username,
      };
      const updatedData = await updatePostIntoTable(data);
      return handleResponse(res, 200, 'Post updated successfully', {
        data: updatedData,
      });
    } catch (error) {
      console.error('Error updating post', error);
      next(error);
    }
  }
);

// Delete a post
router.delete(
  '/posts/:id',
  authenticateToken,
  verifyPostAuthor,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const dataToDelete = await deletePostFromTable(id);
      return handleResponse(res, 200, 'Post deleted successfully', {
        id: dataToDelete,
      });
    } catch (error) {
      console.error('Error deleting post', error);
      next(error);
    }
  }
);

module.exports = router;
