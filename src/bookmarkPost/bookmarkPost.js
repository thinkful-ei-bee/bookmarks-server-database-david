'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../logger');
const store = require('../store');
const bodyParser = express.json();
const uuid = require('uuid/v4');

router.route('/bookmark')
  .post(bodyParser, (req, res) => {
    const {title, url, desc, rating} = req.body;

    if (!title) {
      logger.error('missing bookmark title in post request');
      return res.status(400).send('title required');
    }

    if (!url) {
      logger.error('missing bookmark url in post request');
      return res.status(400).send('url required');
    }

    if (url.length < 5 || (url.slice(0, 5) !== 'http:' && url.slice(0, 5) !== 'https')) {
      logger.error('invalid url');
      return res.status(400).send('url required with http or https protocol');
    } 

    if (rating) {
      const number = parseInt(rating);

      if (!number) {
        logger.error('invalid rating');
        return res.status(400).send('rating should be a number');
      }

      if (number < 1 || number > 5) {
        logger.error('invalid rating');
        return res.status(400).send('rating should be an integer between 1 and 5');
      }
    }

    const newId = uuid();
    
    const newItem = {
      id: newId,
      title,
      url,
      desc,
      rating
    };

    store.push(newItem);
    res.status(201).json({
      id: newId
    });
  });

module.exports = router;