const express = require('express');
const User = require('../Model/User');
const jwt = require('jsonwebtoken');
const {
  userRegistration,
  userLogin,
  getUser,
  userLogout,
} = require('../Controller/userController');
const { authorization } = require('../Middleware/middleware');
const router = express.Router();

router.post('/register', userRegistration);

router.post('/login', userLogin);

router.get('/protected', authorization, getUser);

router.get('/logout', authorization, userLogout);

module.exports = router;
