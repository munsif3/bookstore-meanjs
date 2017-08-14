(function () {
  'use strict';

  describe('Authors Route Tests', function () {
    // Initialize global variables
    var $scope,
      AuthorsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AuthorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AuthorsService = _AuthorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('authors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/authors');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AuthorsController,
          mockAuthor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('authors.view');
          $templateCache.put('modules/authors/client/views/view-author.client.view.html', '');

          // create mock Author
          mockAuthor = new AuthorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Author Name'
          });

          // Initialize Controller
          AuthorsController = $controller('AuthorsController as vm', {
            $scope: $scope,
            authorResolve: mockAuthor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:authorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.authorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            authorId: 1
          })).toEqual('/authors/1');
        }));

        it('should attach an Author to the controller scope', function () {
          expect($scope.vm.author._id).toBe(mockAuthor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/authors/client/views/view-author.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AuthorsController,
          mockAuthor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('authors.create');
          $templateCache.put('modules/authors/client/views/form-author.client.view.html', '');

          // create mock Author
          mockAuthor = new AuthorsService();

          // Initialize Controller
          AuthorsController = $controller('AuthorsController as vm', {
            $scope: $scope,
            authorResolve: mockAuthor
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.authorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/authors/create');
        }));

        it('should attach an Author to the controller scope', function () {
          expect($scope.vm.author._id).toBe(mockAuthor._id);
          expect($scope.vm.author._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/authors/client/views/form-author.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AuthorsController,
          mockAuthor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('authors.edit');
          $templateCache.put('modules/authors/client/views/form-author.client.view.html', '');

          // create mock Author
          mockAuthor = new AuthorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Author Name'
          });

          // Initialize Controller
          AuthorsController = $controller('AuthorsController as vm', {
            $scope: $scope,
            authorResolve: mockAuthor
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:authorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.authorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            authorId: 1
          })).toEqual('/authors/1/edit');
        }));

        it('should attach an Author to the controller scope', function () {
          expect($scope.vm.author._id).toBe(mockAuthor._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/authors/client/views/form-author.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
