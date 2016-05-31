/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    },
  {
    provider: 'local',
    name: 'Bart',
    email: 'bart@example.com',
    password: 'bart'
  },
  {
    provider: 'local',
    name: 'Millhouse',
    email: 'millhouse@example.com',
    password: 'millhouse'
  },
  {
    provider: 'local',
    name: 'Lisa',
    email: 'lisa@example.com',
    password: 'lisa'
  },
  {
    provider: 'local',
    name: 'Ralph',
    email: 'ralph@example.com',
    password: 'ralph'
  }



)
    .then(() => {
      console.log('finished populating users');
    });
  });
