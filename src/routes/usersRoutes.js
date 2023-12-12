const express = require('express');
const router = express.Router();

const { handleDBQuery } = require('../helpers/routerFns');
const { bcryptHashPassword } = require('../helpers/auth');
const { handleSuccess } = require('../helpers/errorHandler');

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const userID = await bcryptHashPassword(userData);

    handleSuccess(res, 'Registered new user', { id: userID });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/viewUsers', async (req, res) => {
  try {
    const users = await handleDBQuery('SELECT * FROM registered_users', []);

    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
