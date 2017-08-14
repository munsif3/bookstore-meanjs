'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Book = mongoose.model('Book'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  book;

/**
 * Book routes tests
 */
describe('Book CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Book
    user.save(function () {
      book = {
        name: 'Book name'
      };

      done();
    });
  });

  it('should be able to save a Book if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Book
        agent.post('/api/books')
          .send(book)
          .expect(200)
          .end(function (bookSaveErr, bookSaveRes) {
            // Handle Book save error
            if (bookSaveErr) {
              return done(bookSaveErr);
            }

            // Get a list of Books
            agent.get('/api/books')
              .end(function (booksGetErr, booksGetRes) {
                // Handle Books save error
                if (booksGetErr) {
                  return done(booksGetErr);
                }

                // Get Books list
                var books = booksGetRes.body;

                // Set assertions
                (books[0].user._id).should.equal(userId);
                (books[0].name).should.match('Book name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Book if not logged in', function (done) {
    agent.post('/api/books')
      .send(book)
      .expect(403)
      .end(function (bookSaveErr, bookSaveRes) {
        // Call the assertion callback
        done(bookSaveErr);
      });
  });

  it('should not be able to save an Book if no name is provided', function (done) {
    // Invalidate name field
    book.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Book
        agent.post('/api/books')
          .send(book)
          .expect(400)
          .end(function (bookSaveErr, bookSaveRes) {
            // Set message assertion
            (bookSaveRes.body.message).should.match('Please fill Book name');

            // Handle Book save error
            done(bookSaveErr);
          });
      });
  });

  it('should be able to update an Book if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Book
        agent.post('/api/books')
          .send(book)
          .expect(200)
          .end(function (bookSaveErr, bookSaveRes) {
            // Handle Book save error
            if (bookSaveErr) {
              return done(bookSaveErr);
            }

            // Update Book name
            book.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Book
            agent.put('/api/books/' + bookSaveRes.body._id)
              .send(book)
              .expect(200)
              .end(function (bookUpdateErr, bookUpdateRes) {
                // Handle Book update error
                if (bookUpdateErr) {
                  return done(bookUpdateErr);
                }

                // Set assertions
                (bookUpdateRes.body._id).should.equal(bookSaveRes.body._id);
                (bookUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Books if not signed in', function (done) {
    // Create new Book model instance
    var bookObj = new Book(book);

    // Save the book
    bookObj.save(function () {
      // Request Books
      request(app).get('/api/books')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Book if not signed in', function (done) {
    // Create new Book model instance
    var bookObj = new Book(book);

    // Save the Book
    bookObj.save(function () {
      request(app).get('/api/books/' + bookObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', book.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Book with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/books/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Book is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Book which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Book
    request(app).get('/api/books/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Book with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Book if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Book
        agent.post('/api/books')
          .send(book)
          .expect(200)
          .end(function (bookSaveErr, bookSaveRes) {
            // Handle Book save error
            if (bookSaveErr) {
              return done(bookSaveErr);
            }

            // Delete an existing Book
            agent.delete('/api/books/' + bookSaveRes.body._id)
              .send(book)
              .expect(200)
              .end(function (bookDeleteErr, bookDeleteRes) {
                // Handle book error error
                if (bookDeleteErr) {
                  return done(bookDeleteErr);
                }

                // Set assertions
                (bookDeleteRes.body._id).should.equal(bookSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Book if not signed in', function (done) {
    // Set Book user
    book.user = user;

    // Create new Book model instance
    var bookObj = new Book(book);

    // Save the Book
    bookObj.save(function () {
      // Try deleting Book
      request(app).delete('/api/books/' + bookObj._id)
        .expect(403)
        .end(function (bookDeleteErr, bookDeleteRes) {
          // Set message assertion
          (bookDeleteRes.body.message).should.match('User is not authorized');

          // Handle Book error error
          done(bookDeleteErr);
        });

    });
  });

  it('should be able to get a single Book that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Book
          agent.post('/api/books')
            .send(book)
            .expect(200)
            .end(function (bookSaveErr, bookSaveRes) {
              // Handle Book save error
              if (bookSaveErr) {
                return done(bookSaveErr);
              }

              // Set assertions on new Book
              (bookSaveRes.body.name).should.equal(book.name);
              should.exist(bookSaveRes.body.user);
              should.equal(bookSaveRes.body.user._id, orphanId);

              // force the Book to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Book
                    agent.get('/api/books/' + bookSaveRes.body._id)
                      .expect(200)
                      .end(function (bookInfoErr, bookInfoRes) {
                        // Handle Book error
                        if (bookInfoErr) {
                          return done(bookInfoErr);
                        }

                        // Set assertions
                        (bookInfoRes.body._id).should.equal(bookSaveRes.body._id);
                        (bookInfoRes.body.name).should.equal(book.name);
                        should.equal(bookInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Book.remove().exec(done);
    });
  });
});
