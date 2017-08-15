(function () {
  'use strict';

  angular
    .module('authors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Authors',
      state: 'authors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'authors', {
      title: 'List Authors',
      state: 'authors.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'authors', {
      title: 'Create Author',
      state: 'authors.create',
      roles: ['user']
    });
  }
}());
