'use strict';

import User from './user.model';
// required for Object creation
import mongoose from 'mongoose';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin' for all and authenticated to get everything other than connection
 */
export function index(req, res) {
  var omit = false;
  if (!_.isEmpty(req.user.role) && req.user.role != 'admin') {
    omit = true;
  }
  var query = {}

  //console.log('params coming in to index:', req.query)
  if (req.query.user_name && !_.isEmpty(req.query.user_name)) {
    var input = req.query.user_name.toString();
    query = {"name": new RegExp(input, "i")}
  }
  return User.find(query, '-salt -password').exec()
    .then(users => {
      var newUser = [];
      console.log('omit', omit)
      if (omit) {
        _.forEach(users, function (val) {
          if (val.role != 'admin') {
            newUser.push(_.omit(val.toObject(), ['connections']));
          }
        })
        res.status(200).json(newUser);
      } else {
        res.status(200).json(users);
      }

    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function (user) {
      var token = jwt.sign({_id: user._id}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token});
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;
  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Get a multiple users
 */
export function showList(req, res, next) {
  var userIdsString = req.query.ids;
  if (_.isEmpty(userIdsString)) {
    return res.status(404).end();
  }
  var userIds = userIdsString.split(',');

  var mongooseObjectList = [];
  _.forEach(userIds, function (id) {
    let tempObj = mongoose.Types.ObjectId(id);
    mongooseObjectList.push(tempObj);
  })
  return User.find({'_id': {$in: mongooseObjectList}}).exec()
    .then(users => {
      if (!users) {
        return res.status(404).end();
      }
      // don't show users for simplicity
      var newUsers = [];
      _.forEach(users, function (val) {
        newUsers.push(_.omit(val.toObject(), ['connections']));
      })
      res.json(newUsers);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;
  return User.findOne({_id: userId}, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Connect To A user
 */
export function connect(req, res, next) {
  console.log("req", req.params);
  var connectId = req.params.id;
  var userId = req.user._id;
  return User.findOne({_id: userId}, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      } else {
        return User.findOne({_id: connectId}).exec()
          .then(user2 => { // don't ever give out the password or salt
            if (!user2) {
              return res.status(401).end();
            } else {
              return user2.update({$addToSet: {connections: userId}})
                .then(function () {
                  console.log('user only', user)
                  return user.update({$addToSet: {connections: connectId}})
                }).then(
                  function () {
                    res.status(204).end();
                  }
                )
            }

          });
      }
    })
    .catch(err => next(err)
    )
    ;
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
