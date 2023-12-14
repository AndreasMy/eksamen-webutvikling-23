const express = require('express');
const router = express.Router();

const { handleDBQuery, getUsernamesByUserId } = require('../helpers/routerFns');
const { authenticateToken, verifyPostAuthor } = require('../helpers/auth');
const {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
} = require('../models/postTable');
const { handleSuccess } = require('../helpers/errorHandler');

// Get all posts
router.get('/posts', async (req, res, next) => {
  try {
    let posts = await handleDBQuery('SELECT * FROM blog_posts');
    usernames = await getUsernamesByUserId();

    posts.forEach((post) => {
      post.username = usernames[post.userId] || 'Unknown user';
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
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
    next(error);
  }
});

router.post('/posts', authenticateToken, async (req, res, next) => {
  try {
    console.log(req.user);
    const data = { ...req.body, userId: req.user.id };
    const updatedID = await insertPostIntoTable(data);
    return handleSuccess(res, 'Post created successfully', { id: updatedID });
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
      return handleSuccess(res, 'Post updated successfully', {
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
      return handleSuccess(res, 'Post deleted successfully', {
        id: dataToDelete,
      });
    } catch (error) {
      console.error('Error deleting post', error);
      next(error);
    }
  }
);

module.exports = router;
