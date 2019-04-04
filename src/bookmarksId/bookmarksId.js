'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../logger');
const store = require('../store');

router.route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = store.find(item => item.id === id);
   
    if (!bookmark) {
      logger.error(`no bookmark found with id ${id}`);
      return res.status(401).send('not found');
    }    
    res.status(200).json(bookmark);
  });

module.exports = router;