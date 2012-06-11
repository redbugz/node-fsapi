var everyauth = require('everyauth'),
  request = require('request'),

  usersById = {};

function validateSession(sessionId, userId, user) {
  uri = process.env.REFERENCE_HOST + "/identity/v2/session?dataFormat=application/json&sessionId=" + sessionId;
  return function (callback) {
    request.get({uri:uri}, function (error, response, body) {
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
module.exports = function (app, config) {
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
  // TODO: Add another middleware that recognizes Grails sessions and creates EveryAuth users...
  app.use(function (req, res, next) {
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
  app.use(function (req, res, next) {
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