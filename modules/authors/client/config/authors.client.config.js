(function () {
  'use strict';

  angular
    .module('authors')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Authors',
      state: 'authors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'authors', {
      title: 'List Authors',
      state: 'authors.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'authors', {
      title: 'Create Author',
      state: 'authors.create',
      roles: ['user']
    });
  }
}());
