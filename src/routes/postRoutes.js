const express = require('express');
const { handleDBQuery } = require('./helpers/routerFns');
const {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
} = require('../models/postTable');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secretKey = 'gokstadakademiet';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

router.post('/posts', authenticateToken, async (req, res) => {
  let data = req.body;
  data.username = req.user.username;
  console.log(data);

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

router.get('/posts', (req, res) => {
  const id = req.body.id;
  handleDBQuery(req, res, 'SELECT * FROM blog_posts', [id]);
});

// Hent en post på ID
router.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  handleDBQuery(req, res, 'SELECT * FROM blog_posts WHERE id = ?', [id], true);
});

// Slett en post
router.delete('/posts/:id', async (req, res) => {
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
