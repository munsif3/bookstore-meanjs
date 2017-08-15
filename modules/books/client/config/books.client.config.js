(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Books',
      state: 'books',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'books', {
      title: 'List Books',
      state: 'books.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'books', {
      title: 'Create Book',
      state: 'books.create',
      roles: ['user']
    });
  }
}());
