'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../logger');
const bookmarkService = require('../bookmarks/bookmarkService');
const bodyParser = express.json();

router.route('/bookmark')
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
  });
  

module.exports = router;