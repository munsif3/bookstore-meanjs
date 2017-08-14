// Authors service used to communicate Authors REST endpoints
(function () {
  'use strict';

  angular
    .module('authors')
    .factory('AuthorsService', AuthorsService);

  AuthorsService.$inject = ['$resource'];

  function AuthorsService($resource) {
    return $resource('api/authors/:authorId', {
      authorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
