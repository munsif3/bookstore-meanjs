(function () {
  'use strict';

  // Authors controller
  angular
    .module('authors')
    .controller('AuthorsController', AuthorsController);

  AuthorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'authorResolve'];

  function AuthorsController ($scope, $state, $window, Authentication, author) {
    var vm = this;

    vm.authentication = Authentication;
    vm.author = author;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Author
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.author.$remove($state.go('authors.list'));
      }
    }

    // Save Author
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.authorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.author._id) {
        vm.author.$update(successCallback, errorCallback);
      } else {
        vm.author.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('authors.view', {
          authorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
