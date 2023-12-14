const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const { insertUserIntoDB } = require('../models/userTable');
const { sendErrorResponse } = require('./errorHandler');
const { handleDBQuery } = require('./routerFns');

const app = express();
const secretKey = process.env.SECRET_KEY; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const verifyPostAuthor = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const getPostResult = await handleDBQuery(
      'SELECT * FROM blog_posts WHERE id = ?',
      [req.params.id],
      true
    );

    if (!getPostResult) {
      return sendErrorResponse(res, 404, 'Post not found');
    }

    const postAuthor = getPostResult.username;
    if (currentUser !== postAuthor) {
      return sendErrorResponse(
        res,
        401,
        'You are not authorized to change this entry'
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware for gatekeeping admin related CRUD operations
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return sendErrorResponse(
      res,
      401,
      'You must be logged in to perform this operation.'
    );
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return sendErrorResponse(
        res,
        401,
        'You must be logged in to perform this operation.'
      );
    }

    req.user = user;
    next();
  });
};

const signJwtToken = (user) => {
  return (token = jwt.sign(
    { id: user.id, username: user.username },
    secretKey,
    { expiresIn: '1h' }
  ));
};

const setCookie = (res, token) => {
  res.cookie('token', token, {
    maxAge: 900000,
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  });
};

const bcryptComparePassword = async (password, user) => {
  try {
    const match = bcrypt.compare(password, user.password);
    return match;
  } catch (error) {
    throw new Error('Error validating password');
  }
};

const bcryptHashPassword = async (data) => {
  const saltRounds = 10;
  const password = data.password;

  return new Promise((resolve, reject) => {
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        data.password = hash;
        return insertUserIntoDB(data);
      })
      .then((userID) => resolve(userID))
      .catch((err) => reject(err));
  });
};

module.exports = {
  verifyPostAuthor,
  signJwtToken,
  setCookie,
  authenticateToken,
  secretKey,
  bcryptHashPassword,
  bcryptComparePassword,
};
