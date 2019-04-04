'use strict';

const express = require('express');
const router = express.Router();
const store = require('../store');

router.route('/bookmarks')
  .get((req, res) => {
    res.json(store);
  });

module.exports = router;