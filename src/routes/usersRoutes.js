const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { insertUserIntoDB } = require('../models/userTable');
const { handleDBQuery } = require('./helpers/routerFns');

router.post('/users/register', (req, res) => {
  const userData = req.body;
  console.log(userData);
  const saltRounds = 10;
  const password = userData.password;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      userData.password = hash;
      return insertUserIntoDB(userData);
    })
    .then((userID) => res.status(200).send({ id: userID }))
    .catch((err) => res.status(500).send('Error creating user: ' + err));
});

router.get('/users/viewUsers', (req, res) => {
  handleDBQuery(req, res, 'SELECT * FROM registered_users', []);
});

module.exports = router;
