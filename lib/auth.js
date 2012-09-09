var   request = require('request')
    , util = require('util')
    , debug = require('debug')("fsapi:auth")
    , passport = require('passport')
    , FamilySearchStrategy = require('passport-familysearch').Strategy;

module.exports = function(app, config){
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete FamilySearch profile is
//   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    debug("serializeUser:", user);
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    debug("deserializeUser:", obj);
    done(null, obj);
  });

// Use the FamilySearchStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and FamilySearch profile), and
//   invoke a callback with a user object.
  passport.use(new FamilySearchStrategy({
        requestTokenURL: config.requestTokenURL || config.referenceHost + '/identity/v2/request_token',
        accessTokenURL: config.accessTokenURL || config.referenceHost + '/identity/v2/access_token',
        userAuthorizationURL: config.userAuthorizationURL || config.referenceHost + '/identity/v2/authorize',
        userProfileURL: config.userProfileURL || config.referenceHost + '/identity/v2/user',
        consumerKey: config.developerKey,
        consumerSecret: '',
        callbackURL: config.callbackURL
      },
      function(token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        profile.sessionId = token;
        process.nextTick(function () {

          // To keep the example simple, the user's FamilySearch profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the FamilySearch account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
  ));
  app.use(function(req,res,next) {
//    debug("before init&session req.url: %j req.session: %j req.cookies: %j", req.url, req.session, req.cookies);
//    debug("before init&session req.url: %j req.user: %j req.cookies.fssessionid: %j, req.cookies['fssessionid']: %j", req.url, req.user, req.cookies.fssessionid, req.cookies['fssessionid']);
    if (req.cookies.fssessionid) {
//      debug('auth w/familysearch');
//      passport.authenticate("familysearch");
    }
    next();
  })
  app.use(passport.initialize());
//  app.use(function(req,res,next) {
//    debug("after  init req.url: %j req.session: %j req.cookies: %j", req.url, req.session, req.cookies);
//    debug("after  init req.url: %j req.user: %j", req.url, req.user);
//    if (!req.user && req.cookies.fssessionid) {
//      debug('auth w/session');
//      passport._strategies["familysearch"].userProfile(req.cookies.fssessionid, null, {}, function(err, profile) {debug("got profile", err, profile);next();});
//    } else {
//      next();
//    }
//  });
  app.use(passport.session());
//  app.use(function(req,res,next) {
//    debug("after  init&session req.url: %j req.session: %j req.cookies: %j", req.url, req.session, req.cookies);
//    debug("after  init&session req.url: %j req.user: %j", req.url, req.user);
//    if (!req.user && req.cookies.fssessionid) {
//      debug('auth w/session');
//      passport._strategies["familysearch"].userProfile(req.cookies.fssessionid, null, {}, function(err, profile) {debug("got profile", err, profile);next();});
//    } else {
//      next();
//    }
//  });
  app.use(function(req,res,next) {
//    debug("got to next");
    next();
  });


// GET /auth/familysearch
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in FamilySearch authentication will involve redirecting
//   the user to familysearch.org.  After authorization, FamilySearch will redirect the user
//   back to this application at /auth/familysearch/callback
  app.get('/auth/familysearch',
      passport.authenticate('familysearch'),
      function(req, res){
        // The request will be redirected to FamilySearch for authentication, so this
        // function will not be called.
      });

// GET /auth/familysearch/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
  app.get('/auth/familysearch/callback',
      passport.authenticate('familysearch', { failureRedirect: '/login' }),
      function(req, res) {
        debug("setting fssessionid cookie on response: ",req.user.sessionId);
        res.cookie("fssessionid", req.user.sessionId, {"path":"/", httpOnly: true});
        var redirectUrl = req.session._redirectUrl;
        delete req.session._redirectUrl;
        res.redirect(redirectUrl || "/");
      });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  function validateSession(sessionId, userId, user) {
    uri = process.env.REFERENCE_HOST+"/identity/v2/session?dataFormat=application/json&sessionId=" + sessionId;
    return function (callback) {
      request.get({uri: uri}, function(error, response, body) {
        debug("Response", response.statusCode, "from", uri);
        if (error) {
          return callback(error);
        } else if (response.statusCode != 200) {
          return callback(null, null);
        } else {
          usersById[userId] = user;
          return callback(null, user);
        }
      });
    }
  };

  return {
    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    ensureAuthenticated: function (req, res, next) {
      debug("ensureAuthenticated:", req.url);
      if (req.isAuthenticated()) {
        return next();
      }
      req.session._redirectUrl = req.url;
      res.redirect('/auth/familysearch');
    }
  }
};