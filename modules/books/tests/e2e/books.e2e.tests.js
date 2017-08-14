'use strict';

describe('Books E2E Tests:', function () {
  describe('Test Books page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/books');
      expect(element.all(by.repeater('book in books')).count()).toEqual(0);
    });
  });
});
