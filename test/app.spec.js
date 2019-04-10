'use strict';
require('dotenv').config();
/* global supertest */
const app = require('../src/app');

describe('App', () => {
  it('GET / without authorization responds with 401', () => {
    return supertest(app)
      .get('/')
      .expect(401);
  });
});