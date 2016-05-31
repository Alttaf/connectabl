'use strict';

import app from '../..';
import User from './user.model';
import request from 'supertest';

describe('User API:', function() {
  var user;
  var user2;
  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test1@example.com',
        password: 'password'
      });
      console.log(user)
      return user.save()
    })
  });

  // // Clear users after testing
  after(function() {
    return User.remove();
  });

  // describe('GET /api/users/me', function() {
  //   var token;
  //
  //   before(function(done) {
  //     request(app)
  //       .post('/auth/local')
  //       .send({
  //         email: 'test@example.com',
  //         password: 'password'
  //       })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //       token = res.body.token;
  //     done();
  //   });
  //   });
  //
  //   it('should respond with a user profile when authenticated', function(done) {
  //     request(app)
  //       .get('/api/users/me')
  //       .set('authorization', 'Bearer ' + token)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //       res.body._id.toString().should.equal(user._id.toString());
  //     done();
  //   });
  //   });
  //
  //   it('should respond with a 401 when not authenticated', function(done) {
  //     request(app)
  //       .get('/api/users/me')
  //       .expect(401)
  //       .end(done);
  //   });
  // });

  describe('GET /api/users/connect', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'tes1t@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
        token = res.body.token;
      console.log(token)
          done();
        });
    });

    it.only('should respond with a user profile when authenticated abbbccs', function(done) {

      request(app)
        .get('/api/users/me')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(function(err, res){
          console.log(res)
          res.body._id.toString().should.equal(user._id.toString());
          done();
      });
    });
  });
});
