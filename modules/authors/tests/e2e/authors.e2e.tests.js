'use strict';

describe('Authors E2E Tests:', function () {
  describe('Test Authors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/authors');
      expect(element.all(by.repeater('author in authors')).count()).toEqual(0);
    });
  });
});
