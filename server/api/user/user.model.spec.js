'use strict';

import app from '../..';
import User from './user.model';
import * as controller from './user.controller';
var user;
var user2;
var genUser = function() {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

var genUser2 = function(){


    user = new User({
      provider: 'local',
      name: 'Fake User1',
      email: 'test1@example.com',
      password: 'password'
    });

    user2 = new User({
      provider: 'local',
      name: 'Fake User2',
      email: 'test2@example.com',
      password: 'password'
    });


}

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.remove();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.remove();
  });

  it('should begin with no users', function() {
    return User.find({}).exec().should
      .eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return user.save()
      .then(function() {
        var userDup = genUser();
        return userDup.save();
      }).should.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving with a blank email', function() {
      user.email = '';
      return user.save().should.be.rejected;
    });

    it('should fail when saving with a null email', function() {
      user.email = null;
      return user.save().should.be.rejected;
    });

    it('should fail when saving without an email', function() {
      user.email = undefined;
      return user.save().should.be.rejected;
    });
  });

  describe('#password', function() {
    it('should fail when saving with a blank password', function() {
      user.password = '';
      return user.save().should.be.rejected;
    });

    it('should fail when saving with a null password', function() {
      user.password = null;
      return user.save().should.be.rejected;
    });

    it('should fail when saving without a password', function() {
      user.password = undefined;
      return user.save().should.be.rejected;
    });

    describe('given the user has been previously saved', function() {
      beforeEach(function() {
        return user.save();
      });

      it('should authenticate user if valid', function() {
        user.authenticate('password').should.be.true;
      });

      it('should not authenticate user if invalid', function() {
        user.authenticate('blah').should.not.be.true;
      });

      it('should remain the same hash unless the password is updated', function() {
        user.name = 'Test User';
        return user.save()
          .then(function(u) {
            return u.authenticate('password');
          }).should.eventually.be.true;
      });
    });
  });

});

describe('User Model', function() {
  before(function () {
    // Clear users before testing
    return User.remove();
  });

  beforeEach(function () {
    genUser2();
  });

  afterEach(function () {
    return User.remove();
  });

  it.skip('should check if a user can connect to another', function () {

  console.log('controller',controller);
  console.log('user',user);
    controller.connect({params:{id:user2._id},user:user},{},function(){}).
      then(function(res){
      console.log('result of connection',res)
    });


  });
});
