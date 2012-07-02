var everyauth   = require('everyauth'),
    request     = require('request'),
    passport = require('passport')
    , util = require('util')
    , FamilySearchStrategy = require('passport-familysearch').Strategy;

  usersById = {};

var FAMILYSEARCH_DEVELOPER_KEY = "WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK"

function validateSession(sessionId, userId, user) {
  uri = process.env.REFERENCE_HOST+"/identity/v2/session?dataFormat=application/json&sessionId=" + sessionId;
  return function (callback) {
    request.get({uri: uri}, function(error, response, body) {
      console.log("Response", response.statusCode, "from", uri);
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
}
;

//Setup global logger for logging to external endpoint
module.exports = function(app, config){
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete FamilySearch profile is
//   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

// Use the FamilySearchStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and FamilySearch profile), and
//   invoke a callback with a user object.
  passport.use(new FamilySearchStrategy({
        requestTokenURL: 'https://sandbox.familysearch.org/identity/v2/request_token',
        accessTokenURL: 'https://sandbox.familysearch.org/identity/v2/access_token',
        userAuthorizationURL: 'https://sandbox.familysearch.org/identity/v2/authorize',
        userProfileURL: 'https://sandbox.familysearch.org/identity/v2/user',
        consumerKey: FAMILYSEARCH_DEVELOPER_KEY,
        consumerSecret: '',
        callbackURL: "http://127.0.0.1:5000/auth/familysearch/callback"
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
  app.use(passport.initialize());
  app.use(passport.session());


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
        res.cookie("fssessionid", req.user.sessionId);
        res.redirect('/');
      });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  console.dir(everyauth);
  console.dir(everyauth.everymodule);
  // everyauth.everymodule.configure({
  //   findUserById: function(id, callback){
  //     if('function' === typeof usersById[id]) {
  //       var validateSession = usersById[id];
  //       return validateSession(callback);
  //     }
  //     else {
  //       return callback(null, usersById[id]);
  //     }
  //   }
  // });
  
  // everyauth.familysearch.configure({
  //   developerKey:       process.env.FS_DEV_KEY || "WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK",
  //   referenceHost:      process.env.REFERENCE_HOST || "https://sandbox.familysearch.org",
  //   userAgent:          "FS-Bootstrap - {name}/{version}".format(config),
  //   redirectPath:       "/",

  //   findOrCreateUser: function(sess, accessToken, accessSecret, fsUser) {
  //     usersById[fsUser.id] = usersById[fsUser.id] || fsUser;
  //     return usersById[fsUser.id];
  //   }
  // });
  
  // Validate session data created by another server using EveryAuth
  app.use(function(req, res, next) {
    //Setup one-time function to check that FS Session is still valid
    var userId = req.session && req.session.auth && req.session.auth.familysearch && req.session.auth.familysearch.user ? req.session.auth.familysearch.user.id : undefined;
    if (!usersById[userId] && req.session && req.session.auth && req.session.auth.familysearch && req.session.auth.familysearch.user) {
      var auth = req.session.auth.familysearch;
      usersById[userId] = validateSession(auth.accessToken, userId, auth.user);
    }

    return next();
  });

  /**
   * Workaraound for EveryAuth when using cookie-sessions instead of connect sessions
   *   - Mimic Connect sessions which have the `.save()` method called automaticall on `res.end()`.
   */
  app.use(function(req, res, next){
    req.session = req.session || {};
    req.session.save = function (fn) {
      if (typeof fn === 'function')
        fn()
      return this;
    };

    var end = res.end;
    res.end = function (data, encoding) {
      res.end = end;
      if (req.session) {
        req.session.save(function () {
          return res.end(data, encoding);
        });
        return delete req.session.save;
      }
      else {
        return res.end(data, encoding);
      }
    }

    return next();
  });

  everyauth.debug = true;
  app.use(everyauth.middleware());
};