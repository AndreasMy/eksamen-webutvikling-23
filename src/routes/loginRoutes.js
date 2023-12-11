const express = require('express');
const router = express.Router();
const {
  bcryptComparePassword,
  signJwtToken,
  setCookie,
} = require('./helpers/auth');
const { handleDBQuery } = require('./helpers/routerFns');

router.use(express.json());

// Login for bruker
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const user = await handleDBQuery(
      `SELECT * FROM registered_users WHERE username = ?`,
      [username],
      true
    );

    if (!user || user.length === 0) {
      res
        .status(400)
        .json({ authenticated: false, message: 'Invalid credentials' });
      return;
    }

    const matchedPassword = await bcryptComparePassword(password, user);
    if (!matchedPassword) {
      return res
        .status(400)
        .json({ authenticated: false, message: 'Invalid credentials' });
    }

    const token = signJwtToken(user);
    setCookie(res, token);
    
    res.status(200).json({
      message: 'Innlogging vellykket!',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error validating password');
  }
});

// Logout for bruker
router.post('/logout', (req, res) => {
  res.clearCookie('isAuth');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
