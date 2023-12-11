const express = require('express');
const router = express.Router();
const { handleDBQuery } = require('./helpers/routerFns');
const { bcryptHashPassword } = require('./helpers/auth');

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const userID = await bcryptHashPassword(userData);

    res.status(200).send({ id: userID });
  } catch (error) {
    console.error(error); //TypeError: bcryptHashPassword is not a function
    res.status(500).send('Error creating user: ' + error);
  }
});

router.get('/viewUsers', async (req, res) => {
  try {
    const users = await handleDBQuery(
      req,
      res,
      'SELECT * FROM registered_users',
      []
    );

    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
