'use strict';

class SearchController {
  //end-non-standard

  //start-non-standard
  constructor(Auth, $http, $scope, socket) {

    function _searchUsers(user_name){
      var query = '/api/users';
      if(user_name){
        query = '/api/users?user_name='+user_name
      }

      this.$http.get(query)
        .then(response => {
        this.users = response.data;
        console.log('search users called',this.users);
    });

    }
    this._searchUsers = _searchUsers;
    this.$http = $http;
    this.socket = socket;
    this.users = [];
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  searchUsers(){
      this._searchUsers(this.newThing)

  }

  $onInit(){
    this._searchUsers();
  }



}

angular.module('nodeApp')
  .controller('SearchController', SearchController);
