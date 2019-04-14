'use strict';

const express = require('express');
const router = express.Router();
const logger = require('../logger');
const bookmarkService = require('../bookmarks/bookmarkService');

router.route('/api/bookmarks/:id')
  .get((req, res) => {
    const knex = req.app.get('db');
    const { id } = req.params;
    const bookmark = bookmarkService.getById(knex, id); 
   
    if (!bookmark) {
      logger.error(`no bookmark found with id ${id}`);
      return res.status(404).send('not found');
    }    
    res.status(200).json(bookmark);
  })
  .delete((req, res, next) => {
    const knex = req.app.get('db');
    const { id } = req.params;
    const bookmark = bookmarkService.getById(knex, id);
   
    if (!bookmark) {
      logger.error(`no bookmark found with id ${id}`);
      return res.status(404).send('not found');
    }

    bookmarkService.deleteMark(knex, id)
      .then (() => {
        res.status(204).end();
      })
      .catch(next);
  });
  

module.exports = router;