const express = require('express');
const { handleDBQuery } = require('./helpers/routerFns');
const {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
} = require('../models/postTable');
const router = express.Router();

// Hent alle poster inkludert username fra users
router.get('/posts', (req, res) => {
  handleDBQuery(req, res, 'SELECT * FROM blog_posts', []);
});

// Hent en post på ID
router.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  handleDBQuery(req, res, 'SELECT * FROM blog_posts WHERE id = ?', [id], true);
});

// Opprett en post
router.post('/posts', async (req, res) => {
  const data = req.body;
  console.log(data);
  return insertPostIntoTable(data)
    .then((id) => {
      res.status(200).json({ message: 'Post created successfully', id: id });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Error creating post', error: error.message });
    });
});

// Oppdater post
router.put('/posts/:id', async (req, res) => {
  const data = req.body;
  console.log(data);
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

// Slett en post
router.delete('/posts/:id', async (req, res) => {
  const data = req.params;
  console.log(data);
  return deletePostFromTable(data)
    .then((data) => {
      res
        .status(200)
        .json({ message: 'Post deleted successfully', data: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Error deleting post', error: error.message });
    });
});

module.exports = router;
