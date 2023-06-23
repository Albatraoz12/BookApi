const express = require('express');
const { createBook } = require('../Controller/bookController');
const { authorization } = require('../Middleware/middleware');

const router = express.Router();

router.post('/createBook', authorization, createBook);

module.exports = router;
