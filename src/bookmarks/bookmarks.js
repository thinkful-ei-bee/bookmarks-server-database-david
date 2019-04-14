'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const bookmarkService = require('./bookmarkService');

router.route('/api/bookmarks')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    bookmarkService.getAllBookmarks(knex)
      .then(articles => {
        res.json(articles);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const {title, url, description, rating} = req.body;
    const newBookmark = { title, url, description, rating };
    const knex = req.app.get('db');
    
    if (url.length < 5 || (url.slice(0, 5) !== 'http:' && url.slice(0, 5) !== 'https')) {
      logger.error('invalid url');
      return res.status(400).send('url required with http or https protocol');
    } 

    if (rating < 1 || rating > 5) {
      logger.error('invalid rating');
      return res.status(400).send('rating should be from 1 to 5');
    }
    bookmarkService.insertMark(knex, newBookmark)
      .then(item => {
        res.status(201).json({
          id: item.id
        });
      })
      .catch(next);
  })
  .patch((req, res) => {
    logger.error('patch request made without id');
    return res.status(400).send('patch request requires an id in url');
  });

module.exports = router;