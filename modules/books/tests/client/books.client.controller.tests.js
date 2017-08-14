(function () {
  'use strict';

  describe('Books Controller Tests', function () {
    // Initialize global variables
    var BooksController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      BooksService,
      mockBook;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _BooksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      BooksService = _BooksService_;

      // create mock Book
      mockBook = new BooksService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Book Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Books controller.
      BooksController = $controller('BooksController as vm', {
        $scope: $scope,
        bookResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleBookPostData;

      beforeEach(function () {
        // Create a sample Book object
        sampleBookPostData = new BooksService({
          name: 'Book Name'
        });

        $scope.vm.book = sampleBookPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (BooksService) {
        // Set POST response
        $httpBackend.expectPOST('api/books', sampleBookPostData).respond(mockBook);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Book was created
        expect($state.go).toHaveBeenCalledWith('books.view', {
          bookId: mockBook._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/books', sampleBookPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Book in $scope
        $scope.vm.book = mockBook;
      });

      it('should update a valid Book', inject(function (BooksService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/books\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('books.view', {
          bookId: mockBook._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (BooksService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/books\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Books
        $scope.vm.book = mockBook;
      });

      it('should delete the Book and redirect to Books', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/books\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('books.list');
      });

      it('should should not delete the Book and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
