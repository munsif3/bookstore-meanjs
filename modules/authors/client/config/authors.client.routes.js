(function () {
  'use strict';

  angular
    .module('authors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('authors', {
        abstract: true,
        url: '/authors',
        template: '<ui-view/>'
      })
      .state('authors.list', {
        url: '',
        templateUrl: 'modules/authors/client/views/list-authors.client.view.html',
        controller: 'AuthorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Authors List'
        }
      })
      .state('authors.create', {
        url: '/create',
        templateUrl: 'modules/authors/client/views/form-author.client.view.html',
        controller: 'AuthorsController',
        controllerAs: 'vm',
        resolve: {
          authorResolve: newAuthor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Authors Create'
        }
      })
      .state('authors.edit', {
        url: '/:authorId/edit',
        templateUrl: 'modules/authors/client/views/form-author.client.view.html',
        controller: 'AuthorsController',
        controllerAs: 'vm',
        resolve: {
          authorResolve: getAuthor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Author {{ authorResolve.name }}'
        }
      })
      .state('authors.view', {
        url: '/:authorId',
        templateUrl: 'modules/authors/client/views/view-author.client.view.html',
        controller: 'AuthorsController',
        controllerAs: 'vm',
        resolve: {
          authorResolve: getAuthor
        },
        data: {
          pageTitle: 'Author {{ authorResolve.name }}'
        }
      });
  }

  getAuthor.$inject = ['$stateParams', 'AuthorsService'];

  function getAuthor($stateParams, AuthorsService) {
    return AuthorsService.get({
      authorId: $stateParams.authorId
    }).$promise;
  }

  newAuthor.$inject = ['AuthorsService'];

  function newAuthor(AuthorsService) {
    return new AuthorsService();
  }
}());
