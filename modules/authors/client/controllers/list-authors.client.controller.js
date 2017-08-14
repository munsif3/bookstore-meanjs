(function () {
  'use strict';

  angular
    .module('authors')
    .controller('AuthorsListController', AuthorsListController);

  AuthorsListController.$inject = ['AuthorsService'];

  function AuthorsListController(AuthorsService) {
    var vm = this;

    vm.authors = AuthorsService.query();
  }
}());
