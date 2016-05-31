'use strict';


import app from '../..';
import User from './user.model';
import request from 'supertest';
import _ from 'lodash';

describe('User API:', function () {
  var user;
  var user2;
  // Clear users before testing
  before(function () {
    return User.remove().then(function () {
      user = new User({
        name: 'Fake User',
        email: 'test123@example.com',
        password: 'test'
      });
      console.log(user)
      return user.save()
    }).then(function () {
      user2 = new User({
        name: 'Fake User',
        email: 'user-2-test123@example.com',
        password: 'test'
      });
      console.log(user2)
      return user2.save()
    })
  });


    // // Clear users after testing
    after(function () {
      return User.remove();
    });

    describe('GET /api/users/me', function () {
      var token;

      before(function (done) {
        request(app)
          .post('/auth/local')
          .send({
            email: 'test123@example.com',
            password: 'test'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            token = res.body.token;
            done();
          });
      });

      it('should respond with a user profile when authenticated', function (done) {
        request(app)
          .get('/api/users/me')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body._id.toString().should.equal(user._id.toString());
            done();
          });
      });

      it('should respond with a 401 when not authenticated', function (done) {
        request(app)
          .get('/api/users/me')
          .expect(401)
          .end(done);
      });


    });

  describe('GET /api/users/connect', function () {
    var token;

    before(function (done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test123@example.com',
          password: 'test'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should respond with a valid connection', function (done) {

      request(app)
        .get('/api/users/connect/' + user2._id.toString())
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end((err, res) => {
          request(app)
            .get('/api/users/me')
            .set('authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
              res.body._id.toString().should.equal(user._id.toString());
              res.body.connections[0].should.equal(user2._id.toString())
              done();
            });

        });

    });
  });

  describe('GET /api/users/', function () {
    var token;

    before(function (done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test123@example.com',
          password: 'test'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    it('should respond with all users but no conections in user data', function (done) {

      request(app)
        .get('/api/users/')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          var hasConnections =_.has(res.body[0],'connections');
          hasConnections.should.equal(false);
          done();
        });

    });

  });


  });//top level describe

