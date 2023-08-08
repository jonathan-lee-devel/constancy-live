// @ts-ignore
import request from 'supertest';
import app from '../src/app';
import {HttpStatus} from '../src/lib/http/HttpStatus';

describe('App Test', () => {
  test('GET /random-url should return 404', (done) => {
    request(app).get('/reset').expect(HttpStatus.NOT_FOUND, done);
  });
});
