'use strict';

const express = require('express');
const router = express.Router();
const store = require('../store');
const bookmarkService = require('./bookmarkService');

router.route('/bookmarks')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    bookmarkService.getAllBookmarks(knex)
      .then(articles => {
        res.json(articles);
      })
      .catch(next);
  });

module.exports = router;