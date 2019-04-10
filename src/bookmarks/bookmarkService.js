'use strict';

const bookmarkService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks');
  },

  insertMark(knex, newMark) {
    return knex
      .insert(newMark)
      .into('bookmarks')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(knex, id) {
    return knex
      .from('bookmarks')
      .select('*')
      .where('id', id).first();
  },

  deleteMark(knex, id) {
    return knex('bookmarks')
      .where({ id })
      .delete();
  },

  updateMark(knex, id, newSiteFields) {
    return knex('bookmarks')
      .where({id })
      .update(newSiteFields);
  }
};

module.exports = bookmarkService;