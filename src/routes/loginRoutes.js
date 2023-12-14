const express = require('express');
const router = express.Router();
const { handleDBQuery } = require('../helpers/routerFns');
const {
  bcryptComparePassword,
  signJwtToken,
  setCookie,
  setUser,
} = require('../helpers/auth');
const { sendErrorResponse, handleSuccess } = require('../helpers/errorHandler');

router.use(express.json());

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await handleDBQuery(
      `SELECT * FROM registered_users WHERE username = ?`,
      [username],
      true
    );

    const userNotFound = !user || user.length === 0;
    const matchedPassword = userNotFound
      ? false
      : await bcryptComparePassword(password, user);

    if (userNotFound || !matchedPassword) {
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
