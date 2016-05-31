'use strict';

class SearchController {
  //end-non-standard

  //start-non-standard
  constructor(Auth, $http, $scope, socket) {

    function _searchUsers(user_name, cb){
      var query = '/api/users';
      if(user_name){
        query = '/api/users?user_name='+user_name
      }
      var that = this;
      this.$http.get(query)
        .then(response => {
        this.users = response.data;
        console.log('search users called',this.users);
        if(cb){
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
          console.log('search users called',this.users);
        }).then(function(){
        that.$http.get('api/users/me')
        .then(response => {
          that.currentUser = response.data;
          return response.data;
          })
        .then(function(me){
          if(me.connections && me.connections.length>0) {
            var connections = me.connections.join(',');
            that.$http.get('api/users/list?ids='+connections)
              .then(response => {
              var resp = _getConnections(me.connections,response.data);
              console.log('resp',resp)
              that.connectionArray = response.data;
          });
          }
        })
      })
    }

    //create  associative array of visible users
    // function mapReduceUsers(users){
    //   var mapped = _.map(users,'connections');
    //   var reduced = _.reduce(mapped,  function(flattened, other) {
    //     return flattened.concat(other);
    //   }, []);
    //   var uniq = _.uniq(reduced);
    //   console.log(uniq);
    //   return uniq;
    //
    //
    // }    //create  associative array of visible users
    function mapReduceUsers(users){
      var name_id_object = {}
      _.forEach(users, function(user){
        name_id_object[user._id] = user.name;
      })
      return name_id_object;
    }

    function _connectWithUserAdmin(user_id, connections) {
      var that = this;
      this.$http.get('api/users/list?ids='+connections)
              .then(response => {
              var resp = _getConnections(me.connections,response.data);
            console.log('resp',resp)
            that.allUsers[user_id] = response.data;
          });

    }




    function _getConnections(connectedArray,connectionArray ){
      console.log('connectionArrayBefore', connectionArray);
      _.forEach(connectionArray, function(user){
        var found = _.indexOf(connectedArray, user._id)
        if(found != -1){
          user.connectedToMe = true;
        }
      });
      console.log('connectionArray', connectionArray);
      return connectionArray;

    }

    function _isConnected(id,connectionArray ){
        var found = _.indexOf(connectionArray, id)
        if(found != -1){
          return true;
        } else{
          return false;
        }
    }

    function _whoami(){
      var that = this;
      this.$http.get('api/users/me')
        .then(response => {
        this.currentUser = response.data;
        return response.data;
        }).then(function(me){
        if(me.connections && me.connections.length>0) {
          var connections = me.connections.join(',');
          that.$http.get('api/users/list?ids='+connections)
            .then(response => {
            that.connectionArray = response.data;
             });
          }
      })
    }
    this.mapReduceUsers =mapReduceUsers;
    this.getConnections = _getConnections;
    this.isConnected = _isConnected;
    this.whoami = _whoami;
    this._searchUsers = _searchUsers;
    this._connectWithUser = _connectWithUser;
    this.$http = $http;
    this.socket = socket;
    this.allUsers = {};
    this.users = [];
    this.connectionArray =[];
    this.currentUser ={}
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  searchUsers(){
      this._searchUsers(this.newThing, this.mapReduceUsers)

  }

  whoami(){
    this.whoami();
  }

  mapReduceUsers(){
    this.mapReduceUsers();
  }

  isConnected(id, array){
    return this._isConnected(id, array);
  }


  connect(user_id){
    this._connectWithUser(user_id)
  }

  $onInit(){
    this._searchUsers(null,  this.mapReduceUsers);
    this.whoami();
    //this.getConnections();
  }



}

angular.module('nodeApp')
  .controller('SearchController', SearchController);
