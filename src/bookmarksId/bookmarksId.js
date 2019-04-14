'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const bookmarkService = require('../bookmarks/bookmarkService');

router.route('/api/bookmarks/:id')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    const id = req.params.id;
    bookmarkService.getById(knex, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`no bookmark found with id ${id}`);
          return res.status(404).send('not found');
        }    
        res.status(200).json(bookmark)
          .catch(next);
      });
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
  })
  .patch(bodyParser, (req, res, next) => {
    const {title, url, description, rating} = req.body;
    const newBookmark = {title, url, description, rating};
    const id = req.params.id;
    const knex = req.app.get('db');
    const oldBookmark = bookmarkService.getById(knex, id);

    if (!oldBookmark) {
      logger.error(`no bookmark found with id ${id}`);
      return res.status(404).send('not found');
    } else if (!title && !url && !description && !rating) {
      logger.error('no data submitted to update');
      return res.status(400).send('no update data submitted');
    } else if (url && (url.length < 5 || (url.slice(0, 5)) !== 'http:' && url.slice(0, 5) !== 'https')) {
      logger.error('invalid url');
      return res.status(400).send('url required with http or https protocol');
    } else if (rating && (rating < 1 || rating > 5)) {
      logger.error('invalid rating');
      return res.status(400).send('rating should be from 1 to 5');
    } else {
      bookmarkService.updateMark(knex, id, newBookmark)
        .then( () => 
          res.status(204).end()
        )
        .catch(next);
    }
  });
    
module.exports = router;