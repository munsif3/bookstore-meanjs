'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Author = mongoose.model('Author'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  author;

/**
 * Author routes tests
 */
describe('Author CRUD tests', function () {

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

    // Save a user to the test db and create new Author
    user.save(function () {
      author = {
        name: 'Author name'
      };

      done();
    });
  });

  it('should be able to save a Author if logged in', function (done) {
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

        // Save a new Author
        agent.post('/api/authors')
          .send(author)
          .expect(200)
          .end(function (authorSaveErr, authorSaveRes) {
            // Handle Author save error
            if (authorSaveErr) {
              return done(authorSaveErr);
            }

            // Get a list of Authors
            agent.get('/api/authors')
              .end(function (authorsGetErr, authorsGetRes) {
                // Handle Authors save error
                if (authorsGetErr) {
                  return done(authorsGetErr);
                }

                // Get Authors list
                var authors = authorsGetRes.body;

                // Set assertions
                (authors[0].user._id).should.equal(userId);
                (authors[0].name).should.match('Author name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Author if not logged in', function (done) {
    agent.post('/api/authors')
      .send(author)
      .expect(403)
      .end(function (authorSaveErr, authorSaveRes) {
        // Call the assertion callback
        done(authorSaveErr);
      });
  });

  it('should not be able to save an Author if no name is provided', function (done) {
    // Invalidate name field
    author.name = '';

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

        // Save a new Author
        agent.post('/api/authors')
          .send(author)
          .expect(400)
          .end(function (authorSaveErr, authorSaveRes) {
            // Set message assertion
            (authorSaveRes.body.message).should.match('Please fill Author name');

            // Handle Author save error
            done(authorSaveErr);
          });
      });
  });

  it('should be able to update an Author if signed in', function (done) {
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

        // Save a new Author
        agent.post('/api/authors')
          .send(author)
          .expect(200)
          .end(function (authorSaveErr, authorSaveRes) {
            // Handle Author save error
            if (authorSaveErr) {
              return done(authorSaveErr);
            }

            // Update Author name
            author.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Author
            agent.put('/api/authors/' + authorSaveRes.body._id)
              .send(author)
              .expect(200)
              .end(function (authorUpdateErr, authorUpdateRes) {
                // Handle Author update error
                if (authorUpdateErr) {
                  return done(authorUpdateErr);
                }

                // Set assertions
                (authorUpdateRes.body._id).should.equal(authorSaveRes.body._id);
                (authorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Authors if not signed in', function (done) {
    // Create new Author model instance
    var authorObj = new Author(author);

    // Save the author
    authorObj.save(function () {
      // Request Authors
      request(app).get('/api/authors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Author if not signed in', function (done) {
    // Create new Author model instance
    var authorObj = new Author(author);

    // Save the Author
    authorObj.save(function () {
      request(app).get('/api/authors/' + authorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', author.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Author with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/authors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Author is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Author which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Author
    request(app).get('/api/authors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Author with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Author if signed in', function (done) {
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

        // Save a new Author
        agent.post('/api/authors')
          .send(author)
          .expect(200)
          .end(function (authorSaveErr, authorSaveRes) {
            // Handle Author save error
            if (authorSaveErr) {
              return done(authorSaveErr);
            }

            // Delete an existing Author
            agent.delete('/api/authors/' + authorSaveRes.body._id)
              .send(author)
              .expect(200)
              .end(function (authorDeleteErr, authorDeleteRes) {
                // Handle author error error
                if (authorDeleteErr) {
                  return done(authorDeleteErr);
                }

                // Set assertions
                (authorDeleteRes.body._id).should.equal(authorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Author if not signed in', function (done) {
    // Set Author user
    author.user = user;

    // Create new Author model instance
    var authorObj = new Author(author);

    // Save the Author
    authorObj.save(function () {
      // Try deleting Author
      request(app).delete('/api/authors/' + authorObj._id)
        .expect(403)
        .end(function (authorDeleteErr, authorDeleteRes) {
          // Set message assertion
          (authorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Author error error
          done(authorDeleteErr);
        });

    });
  });

  it('should be able to get a single Author that has an orphaned user reference', function (done) {
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

          // Save a new Author
          agent.post('/api/authors')
            .send(author)
            .expect(200)
            .end(function (authorSaveErr, authorSaveRes) {
              // Handle Author save error
              if (authorSaveErr) {
                return done(authorSaveErr);
              }

              // Set assertions on new Author
              (authorSaveRes.body.name).should.equal(author.name);
              should.exist(authorSaveRes.body.user);
              should.equal(authorSaveRes.body.user._id, orphanId);

              // force the Author to have an orphaned user reference
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

                    // Get the Author
                    agent.get('/api/authors/' + authorSaveRes.body._id)
                      .expect(200)
                      .end(function (authorInfoErr, authorInfoRes) {
                        // Handle Author error
                        if (authorInfoErr) {
                          return done(authorInfoErr);
                        }

                        // Set assertions
                        (authorInfoRes.body._id).should.equal(authorSaveRes.body._id);
                        (authorInfoRes.body.name).should.equal(author.name);
                        should.equal(authorInfoRes.body.user, undefined);

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
      Author.remove().exec(done);
    });
  });
});
