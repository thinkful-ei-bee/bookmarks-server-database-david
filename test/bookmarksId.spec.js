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
const fakeMark = {
  title: 'fake website',
  url: 'http://www.fakesite.com',
  description: 'a fake website',
  rating: 3
};

describe('Route /api/bookmarks/:id', () => {

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  beforeEach('clear data', () => {
    return db('bookmarks').truncate(); 
  });

  beforeEach('set bookmark', () => {
    return db.into('bookmarks').insert(fakeMark);
  });

  after('disconnect from db', () => db.destroy());

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

  it('GET /api/bookmarks returns 200 and our test bookmark', () => {
    fakeMark.id = 1;
    return supertest(app)
      .get('/api/bookmarks')
      .set(auth)
      .expect(200, [fakeMark]);
  });

  it('PATCH responds with 204 and no content when successful', () => {
    return supertest(app)
      .patch('/api/bookmarks/1')
      .set(auth)
      .send({
        description: 'a faker website'
      })
      .expect(204);
  });

  it('PATCH updates a bookmark with partial data', () => {
    fakeMark.description = 'a faker website';
    return supertest(app)
      .patch('/api/bookmarks/1')
      .set(auth)
      .send({
        description: 'a faker website'
      })
      .expect(204)
      .then(() => {
        return supertest(app)
          .get('/api/bookmarks')
          .set(auth)
          .expect(200, [fakeMark]);
      });  
  });

  it('PATCH responds with 400 if no fields provided', () => {
    return supertest(app)
      .patch('/api/bookmarks/1')
      .set(auth)
      .send({})
      .expect(400);
  });
});