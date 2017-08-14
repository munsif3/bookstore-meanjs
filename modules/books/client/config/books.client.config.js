(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Books',
      state: 'books',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'books', {
      title: 'List Books',
      state: 'books.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'books', {
      title: 'Create Book',
      state: 'books.create',
      roles: ['user']
    });
  }
}());
