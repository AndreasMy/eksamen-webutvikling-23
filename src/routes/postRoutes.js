const express = require('express');
const router = express.Router();

const { handleDBQuery, getAllUserNames } = require('../helpers/routerFns');
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
    const usernames = await getAllUserNames();
    console.log('Output from db', posts);

    // Assign username to each post
    const updatedPosts = posts.map(({ dateCreated, ...post }) => ({
      ...post,
      username: usernames[post.userId] || 'Unknown user',
      datePosted: dateCreated, // Only include 'datePosted' in the response
    }));

    console.log('Output to frontend: ', updatedPosts);

    res.json(updatedPosts);
  } catch (error) {
    console.error('Error fetching posts', error);
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
    console.error('Error fetching posts', error);
    next(error);
  }
});

router.post('/posts', authenticateToken, async (req, res, next) => {
  try {
    const { title, content, datePosted } = req.body;
    const data = {

      userId: req.user.id,
      title,
      content,
      dateCreated: datePosted,
    };
    const newPostId = await insertPostIntoTable(data);
    console.log('new post id:', newPostId);

    return handleSuccess(res, 'Post created successfully', { id: newPostId });
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
      const { title, content, datePosted } = req.body;
      const data = {
        id: req.params.id,
        userId: req.user.id,
        title,
        content,
        dateCreated: datePosted,
      };
      const updatedData = await updatePostIntoTable(data);

      console.log('updated data: ', updatedData); // displays the updated data
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
