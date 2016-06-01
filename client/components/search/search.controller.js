'use strict';

class SearchController {
  //end-non-standard

  //start-non-standard
  constructor(Auth, $http, $scope, socket) {

    function _searchUsers(user_name, cb) {
      var query = '/api/users';
      if (user_name) {
        query = '/api/users?user_name=' + user_name
      }
      var that = this;
      this.$http.get(query)
        .then(response => {
          this.users = response.data;
        //  console.log('search users called', this.users);
          if (cb) {
            that.allUsers = cb(this.users)
          }
        });

    }

    function _connectWithUser(user_id) {
      var query = '';
      if (user_id) {
        query = '/api/users/connect/' + user_id
      }
      var that = this;
      this.$http.get(query)
        .then(response => {
          console.log('search users called', this.users);
        }).then(function () {
        that.$http.get('api/users/me')
          .then(response => {
            that.currentUser = response.data;
            return response.data;
          })
          .then(function (me) {
            if (me.connections && me.connections.length > 0) {
              var connections = me.connections.join(',');
              that.$http.get('api/users/list?ids=' + connections)
                .then(response => {
               //   console.log('resp', resp)
                  that.connectionArray = response.data;
                });
            }
          })
      })
    }

    //create  associative array of visible users
    function mapReduceUsers(users) {
      var name_id_object = {}
      _.forEach(users, function (user) {
        name_id_object[user._id] = user.name;
      })
      return name_id_object;
    }

    function _isConnected(id, connectionArray) {
      var found = _.indexOf(connectionArray, id)
      if (found != -1) {
        return true;
      } else {
        return false;
      }
    }

    function _whoami() {
      var that = this;
      this.$http.get('api/users/me')
        .then(response => {
          this.currentUser = response.data;
          return response.data;
        }).then(function (me) {
        if (me.connections && me.connections.length > 0) {
          var connections = me.connections.join(',');
          that.$http.get('api/users/list?ids=' + connections)
            .then(response => {
              that.connectionArray = response.data;
            });
        }
      })
    }

    //functions used to manipulate the data from the server
    this.mapReduceUsers = mapReduceUsers;
    this.isConnected = _isConnected;
    this._whoami = _whoami;
    this._searchUsers = _searchUsers;
    this._connectWithUser = _connectWithUser;
    //angular providers
    this.$http = $http;
    this.socket = socket;
    //variables used in the dir
    this.allUsers = {};
    this.users = [];
    this.connectionArray = [];
    this.currentUser = {}
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  // runs when user searches
  searchUsers() {
    this._searchUsers(this.newUser, this.mapReduceUsers)

  }

  whoami() {
    this._whoami();
  }

  mapReduceUsers() {
    this.mapReduceUsers();
  }
  // Check if user is connected
  // Check if user is connected
  isConnected(id, array) {
    return this._isConnected(id, array);
  }

  // http call to connect to user
  connect(user_id) {
    this._connectWithUser(user_id)
  }

  // runs on start up
  $onInit() {
    this._searchUsers(null, this.mapReduceUsers);
    this.whoami();
  }


}

angular.module('nodeApp')
  .controller('SearchController', SearchController);
