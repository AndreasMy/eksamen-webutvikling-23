const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

// Login for bruker
router.post('/login', async (req, res) => {
  console.log(req.body);
  const secretKey = 'gokstadakademiet'; // MÅ IKKE ENDRES
  const { username, password } = req.body;
  db.all(
    `SELECT * FROM registered_users WHERE username = ?`,
    [username],
    (error, rows) => {
      if (error) {
        res.status(500).send('Error reading from database');
        return;
      }
      if (rows.length === 0) {
        res
          .status(400)
          .json({ authenticated: false, message: 'Invalid credentials' });
        return;
      }

      const user = rows[0];
      console.log(user);
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            const token = jwt.sign(
              { id: user.id, username: user.username },
              secretKey,
              {
                expiresIn: '1h',
              }
            );
            res.cookie('token', token, {
              maxAge: 900000,
              // httpOnly: true,
              secure: false,
              sameSite: 'lax',
            });
            res.status(200).json({
              message: 'Innlogging vellykket!',
            });
          } else {
            res
              .status(400)
              .json({ authenticated: false, message: 'Invalid credentials' });
          }
        })
        .catch((err) => {
          console.error(err.message);
          res.status(500).send('Error validating password');
        });
    }
  );
});

// Logout for bruker
router.post('/logout', (req, res) => {
  res.clearCookie('isAuth');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
