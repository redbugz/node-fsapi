var	VERSION = '0.0.1',
	http = require('http'),
	querystring = require('querystring'),
	oauth = require('oauth'),
	cookie = require('cookies');

function merge(defaults, options) {
	defaults = defaults || {};
	if (options && typeof options === 'object') {
		var keys = Object.keys(options);
		for (var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			if (options[k] !== undefined) defaults[k] = options[k];
		}
	}
	return defaults;
}


function FSApi(options) {
	if (!(this instanceof FSApi)) return new FSApi(options);

	var defaults = {
		consumer_key: null,

		headers: {
			'Accept': 'application/json',
			'Connection': 'close',
			'User-Agent': 'node-fsapi/' + VERSION
		},

		request_token_url: 'https://api.familysearch.org/identity/v2/request_token',
		access_token_url: 'https://api.familysearch.org/identity/v2/access_token',
		authorize_url: 'https://api.familysearch.org/identity/v2/authorize',

		rest_base: 'https://api.familysearch.org',
		familytree_base: 'https://api.familysearch.org/familytree/v2',

		secure: false, // force use of https for login/gatekeeper
		cookie: 'fssessionid',
		cookie_options: {},
		cookie_secret: null
	};
	this.options = merge(defaults, options);

	this.oauth = new oauth.OAuth(
		this.options.request_token_url,
		this.options.access_token_url,
		this.options.consumer_key,
		this.options.consumer_secret,
		'1.0', null, 'PLAINTEXT', null,
		this.options.headers);
}
FSApi.VERSION = VERSION;
module.exports = FSApi;


/*
 * GET
 */
FSApi.prototype.get = function(url, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
		return this;
	}

	if (url.charAt(0) == '/')
		url = this.options.rest_base + url;

	this.oauth.get(url + '?' + querystring.stringify(params),
		this.options.access_token_key,
		this.options.access_token_secret,
	function(error, data, response) {
		if ( error && error.statusCode ) {
			var err = new Error('HTTP Error '
				+ error.statusCode + ': '
				+ http.STATUS_CODES[error.statusCode]);
			err.statusCode = error.statusCode;
			err.data = error.data;
			callback(err);
		}
		else if (error) {
			callback(error);
		}
		else {
			try {
				var json = JSON.parse(data);
				callback(null, json);
			}
			catch(err) {
				callback(err);
			}
		}
	});
	return this;
}


/*
 * POST
 */
FSApi.prototype.post = function(url, content, content_type, callback) {
	if (typeof content === 'function') {
		callback = content;
		content = null;
		content_type = null;
	} else if (typeof content_type === 'function') {
		callback = content_type;
		content_type = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
		return this;
	}

	if (url.charAt(0) == '/')
		url = this.options.rest_base + url;

	// Workaround: oauth + booleans == broken signatures
	if (content && typeof content === 'object') {
		Object.keys(content).forEach(function(e) {
			if ( typeof content[e] === 'boolean' )
				content[e] = content[e].toString();
		});
	}

	this.oauth.post(url,
		this.options.access_token_key,
		this.options.access_token_secret,
		content, content_type,
	function(error, data, response) {
		if ( error && error.statusCode ) {
			var err = new Error('HTTP Error '
				+ error.statusCode + ': '
				+ http.STATUS_CODES[error.statusCode]
				+ ', API message: ' + error.data);
			err.data = error.data;
			err.statusCode = error.statusCode;
			callback(err);
		}
		else if (error) {
			callback(error);
		}
		else {
			try {
				var json = JSON.parse(data);
				callback(null, json);
			}
			catch(err) {
				callback(err);
			}
		}
	});
	return this;
}


/*
 * SEARCH (not API stable!)
 */
FSApi.prototype.search = function(q, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
		return this;
	}

	var url = this.options.familytree_base + '/search';
	params = merge(params, {fullName:q});
	this.get(url, params, callback);
	return this;
}

/*
 * helpful utilities to retrieve the fssessionid cookie etc.
 */
FSApi.prototype.cookie = function(req) {
	// Fetch the cookie
	try {
		var fssessionid = JSON.parse(req.getSecureCookie(this.options.cookie));
	} catch (error) {
		var fssessionid = null;
	}
	return fssessionid;
}

FSApi.prototype.login = function(mount, success) {
	var self = this,
		url = require('url');

	// Save the mount point for use in gatekeeper
	this.options.login_mount = mount = mount || '/fssessionid';

	// Use secure cookie if forced to https and haven't configured otherwise
	if ( this.options.secure && !this.options.cookie_options.secure )
		this.options.cookie_options.secure = true;
	// Set up the cookie encryption secret if we've been given one
	if ( !cookie.secret && this.options.cookie_secret !== null )
		cookie.secret = this.options.cookie_secret;
	// FIXME: ^ so configs that don't use login() won't work?

	return function handle(req, res, next) {
		var path = url.parse(req.url, true);

		// We only care about requests against the exact mount point
		if ( path.pathname !== mount ) return next();

		// Set the oauth_callback based on this request if we don't have it
		if ( !self.oauth._authorize_callback ) {
			// have to get the entire url because this is an external callback
			// but it's only done once...
			var scheme = (req.socket.secure || self.options.secure) ? 'https://' : 'http://',
				path = url.parse(scheme + req.headers.host + req.url, true);
			self.oauth._authorize_callback = path.href;
		}

		// Fetch the cookie
		var fssessionid = self.cookie(req);

		// We have a winner, but they're in the wrong place
		if ( fssessionid && fssessionid.user_id && fssessionid.access_token_secret ) {
			res.writeHead(302, {'Location': success || '/'});
			res.end();
			return;

		// Returning from FSApi with oauth_token
		} else if ( path.query && path.query.oauth_token && path.query.oauth_verifier && fssessionid && fssessionid.oauth_token_secret ) {
			self.oauth.getOAuthAccessToken(
				path.query.oauth_token,
				fssessionid.oauth_token_secret,
				path.query.oauth_verifier,
			function(error, access_token_key, access_token_secret, params) {
				// FIXME: if we didn't get these, explode
				var user_id = (params && params.user_id) || null,
					screen_name = (params && params.screen_name) || null;

				if ( error ) {
					// FIXME: do something more intelligent
					return next(500);
				} else {
					res.setSecureCookie(self.options.cookie, JSON.stringify({
						user_id: user_id,
						screen_name: screen_name,
						access_token_key: access_token_key,
						access_token_secret: access_token_secret
					}), self.options.cookie_options);
					res.writeHead(302, {'Location': success || '/'});
					res.end();
					return;
				}
			});

		// Begin OAuth transaction if we have no cookie or access_token_secret
		} else if ( !(fssessionid && fssessionid.access_token_secret) ) {
			self.oauth.getOAuthRequestToken(
			function(error, oauth_token, oauth_token_secret, oauth_authorize_url, params) {
				if ( error ) {
					// FIXME: do something more intelligent
					return next(500);
				} else {
					res.setSecureCookie(self.options.cookie, JSON.stringify({
						oauth_token: oauth_token,
						oauth_token_secret: oauth_token_secret
					}), self.options.cookie_options);
					res.writeHead(302, {
						'Location': self.options.authorize_url + '?'
							+ querystring.stringify({oauth_token: oauth_token})
					});
					res.end();
					return;
				}
			});

		// Broken cookie, clear it and return to originating page
		// FIXME: this is dumb
		} else {
			res.clearCookie(self.options.cookie);
			res.writeHead(302, {'Location': mount});
			res.end();
			return;
		}
	};
}

FSApi.prototype.gatekeeper = function(failure) {
	var self = this,
		mount = this.options.login_mount || '/fssessionid';

	return function(req, res, next) {
		var fssessionid = self.cookie(req);

		// We have a winner
		if ( fssessionid && fssessionid.user_id && fssessionid.access_token_secret )
			return next();

		// I pity the fool!
		// FIXME: use 'failure' param to fail with: a) 401, b) redirect
		//        possibly using configured login mount point
		//        perhaps login can save the mount point, then we can use it?
		res.writeHead(401, {}); // {} for bug in stack
		res.end([
			'<html><head>',
			'<meta http-equiv="refresh" content="1;url=' + mount + '">',
			'</head><body>',
			'<h1>FSApi authentication required.</h1>',
			'</body></html>'
		].join(''));
	};
}

// User resources
FSApi.prototype.showUser = function(id, callback) {
  // Lookup will take a single id as well as multiple; why not just use it?
	var url = '/users/lookup.json',
      params = {}, ids = [], names = [];

  if(typeof id === 'string') {
    id = id.replace(/^\s+|\s+$/g, '');
    id = id.split(',');
  }

  // Wrap any stand-alone item in an array.
  id = [].concat(id);

  // Add numbers as userIds, strings as usernames.
  id.forEach(function(item) {
    if (parseInt(item))
      ids.push(item);
    else
      names.push(item);
  });

  params.user_id = ids.toString();
  params.screen_name = names.toString();

	this.get(url, params, callback);
	return this;
};
FSApi.prototype.lookupUser
	= FSApi.prototype.lookupUsers
	= FSApi.prototype.showUser;

FSApi.prototype.searchUser = function(q, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/users/search.json';
	params = merge(params, {q:q});
	this.get(url, params, callback);
	return this;
}
FSApi.prototype.searchUsers
	= FSApi.prototype.searchUser;



// Account resources

FSApi.prototype.validateSession = function(callback) {
	var url = '/identity/v2/session';
	this.get(url, null, callback);
	return this;
}


