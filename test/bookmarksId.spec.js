'use strict';
require('dotenv').config();
/* global supertest */
const knex = require('knex');
const app = require('../src/app');
const auth = {
  'Authorization': `Bearer ${process.env.API_TOKEN}`,
  'Content-Type': 'application/json'
};
let db;

describe('Route /api/bookmarks/:id', () => {

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('create test bookmark', () => {
    db('bookmarks').insert({
      title: 'fake website',
      url: 'http://www.fakesite.com',
      description: 'a fake website',
      rating: 3
    });
  });

  afterEach('remove test bookmark', () => {
    db('bookmarks').where({
      title: 'fake website'
    }).del();
  });

  it('GET /api/bookmarks/:id without authorization responds with 401', () => {
    return supertest(app)
      .get('/api/bookmarks/:id')
      .expect(401);
  });

  it('PATCH without an id in the url responds with 400', () => {
    return supertest(app)
      .patch('/api/bookmarks')
      .set(auth)
      .expect(400);
  });

  it('PATCH responds with 204 and no content when successful', () => {
    return supertest(app)
      .patch('/api/bookmarks/10000')
      .set(auth)
      .send({
        description: 'a faker website'
      })
      .expect(204);
  });
});