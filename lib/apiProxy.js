var httpProxy = require('http-proxy'),
  apiProxy, routingProxy, hostListRegEx = /^\/(?:familytree|identity|reservation|authorities|ct|watch|discussion|sources|links|source-links|temple)\/.*/,
  routingProxy = new httpProxy.RoutingProxy();


module.exports = function (req, res, next) {
  if (hostListRegEx.test(req.url)) {
    console.log("  proxy request: " + req.url);
    console.dir(req.session);
    if (req.user) {
      console.log("adding user sessionId=" + req.user.sessionId);
      req.url = req.url + "?sessionId=" + req.user.sessionId;
    }
    if (req.session && req.session.auth && req.session.auth.familysearch && req.session.auth.familysearch.user) {
      console.dir(req.session.auth.familysearch.user);
//      console.log("adding session sessionId=" + req.session.auth.familysearch.user.sessionId);
//      req.url = req.url+"?sessionId="+req.session.auth.familysearch.user.sessionId;
    }
    return routingProxy.proxyRequest(req, res, {
      host:process.env.PROXY_HOST || "sandbox.familysearch.org",
      port:process.env.PROXY_PORT || 443,
      https:process.env.PROXY_HTTPS || true
    });
  } else {
    return next();
  }
};
