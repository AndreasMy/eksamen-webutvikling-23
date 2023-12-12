const express = require('express');
const router = express.Router();
const { handleDBQuery } = require('../helpers/routerFns');
const {
  bcryptComparePassword,
  signJwtToken,
  setCookie,
} = require('../helpers/auth');
const { sendErrorResponse, handleSuccess } = require('../helpers/errorHandler');

router.use(express.json());

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
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    const matchedPassword = await bcryptComparePassword(password, user);
    if (!matchedPassword) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    const token = signJwtToken(user);
    setCookie(res, token);

    handleSuccess(res, 'Innlogging vellykket!', null);
  } catch (error) {
    next(error);
  }
});

// Logout for bruker
router.post('/logout', (req, res) => {
  res.clearCookie('isAuth');
  res.json({ success: true, message: 'Logged out successfully' });
}); // Error message?

module.exports = router;
