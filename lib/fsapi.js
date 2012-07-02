require('pkginfo')(module, 'version');
var http = require('http'),
  querystring = require('querystring'),
  everyauth = require('everyauth'),
  request = require('request'),
  cookie = require('cookies'),
  auth = require('./auth'),
  utils = require('./utils');
var restler = require('restler');

function FSApi(options) {
  if (!(this instanceof FSApi)) return new FSApi(options);

  var defaults = {
    developerKey:'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN',
    userAgent:'node-fsapi/' + exports.version,
    referenceHost:"https://api.familysearch.org",

    cookie:'fssessionid',
    cookie_options:{},
    cookie_secret:null
  };
  this.options = utils.merge(defaults, options);
//    console.log("module:", module);
//    console.log("exports:", exports);
//    console.log("module.exports:", module.exports);
  this.version = exports.version;
  r = request.defaults({json:true})
}
//console.dir(module);
//console.dir(module.exports);

//FSApi.VERSION = module.version;
module.exports = FSApi;

//console.dir(module.exports);
//console.dir(FSApi());
//console.dir(FSApi({developerKey:"fred"}));

//FSApi.prototype.FS = restler.service(function (session) {
////    console.log("this: ",this);
//// this.defaults.sessionId = session;
//}, {
//  baseURL:this.referenceHost
//}, {
//  update:function (message) {
//    return this.post('/statuses/update.json', { data:{ status:message } });
//  },
//  me:function (session) {
//    return this.get('/familytree/v2/person', { query:{sessionId:session} });
//  },
//  tree:function (id) {
//    return this.get('/familytree/v2/pedigree/' + id, { query:{properties:"all", ancestors:4, 'sessionId':this.defaults.sessionId, 'dataFormat':"application/json"}, headers:{ 'Accept':'application/json', 'User-Agent':'Restler for node.js', 'Cookie':"fssessionid=" + this.defaults.sessionId} });
//  },
//  public_horizon:function (personId, callback) {
//    personId = personId || "";
//    var self = this;
//    var tree = this.tree(personId).on("complete", function (result) {
//      if (result instanceof Error) {
//        console.warn("Error reading tree: ", result);
//      } else {
//        callback(FSApi().calculatePublicHorizon(result));
//      }
//    });
//  }
//});

FSApi.prototype.configureAuth = function(app, options) {
	console.dir(options);
	auth(app, options);
}

FSApi.prototype.tree = function (id) {
  console.log("tree id:" + id);
  return this.get('/familytree/v2/pedigree/' + id, { query:{properties:"all", ancestors:4, 'sessionId':this.sessionId, 'dataFormat':"application/json"}, headers:{ 'Accept':'application/json', 'User-Agent':'fsapi for node.js', 'Cookie':req.cookies()} },
    function callback(a, b, c) {
      console.log("tree callback", a, b, c);
      console.dir(a);
      console.dir(b);
      console.dir(c);
    });
}

/*
 * GET
 */
FSApi.prototype.get = function (url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }
  if (typeof callback !== 'function') {
    throw "Error: Invalid callback for fsapi.get(). Expected get(url, callback) or get(url, params, callback)";
    return this;
  }

  if (url.charAt(0) == '/')
    url = this.options.referenceHost + url;
  var requestURL = url + '?' + querystring.stringify(params);

  console.log("FSApi get url:", requestURL);

//  var headers = {
//    'Cookie': req.cookies(),
//    'Accept': 'application/json'
//  };

  restler.get(requestURL).on('complete',function (result) {
    if (result instanceof Error) {
      console.log('restler complete Error: ', result.message);
    } else {
      console.log("restler complete result", result);
    }
  }).on('error',function (err, result) {
      console.log("restler error: ", err, result);

    }).on('fail',function (data, result) {
      console.log("restler fail: ", data, result);

    }).on('5XX',function (data, result) {
      console.log("restler 5xx: ", data, result);

    }).on('4XX', function (data, result) {
      console.log("restler 4xx: ", data, result);

    });

//	r.get({url: url + '?' + querystring.stringify(params), json:true},
  r.get(requestURL,
    function (error, response, data) {
      console.log("fsapi get response", error, response.statusCode, data);
      console.dir(error);
//        console.dir(response);
      console.dir(data);
      if (error && error.statusCode) {
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
//				var json = JSON.parse(data);
          callback(null, data);
        }
        catch (err) {
          callback(err);
        }
      }
    });
  return this;
}


/*
 * POST
 */
FSApi.prototype.post = function (url, content, content_type, callback) {
  if (typeof content === 'function') {
    callback = content;
    content = null;
    content_type = null;
  } else if (typeof content_type === 'function') {
    callback = content_type;
    content_type = null;
  }

  if (typeof callback !== 'function') {
    throw "FAIL: INVALID CALLBACK.";
    return this;
  }

  if (url.charAt(0) == '/')
    url = this.options.rest_base + url;

  // Workaround: oauth + booleans == broken signatures
  if (content && typeof content === 'object') {
    Object.keys(content).forEach(function (e) {
      if (typeof content[e] === 'boolean')
        content[e] = content[e].toString();
    });
  }

  request.post(url,
    this.options.access_token_key,
    this.options.access_token_secret,
    content, content_type,
    function (error, data, response) {
      if (error && error.statusCode) {
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
        catch (err) {
          callback(err);
        }
      }
    });
  return this;
}


/*
 * SEARCH (not API stable!)
 */
FSApi.prototype.search = function (q, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  if (typeof callback !== 'function') {
    throw "FAIL: INVALID CALLBACK.";
    return this;
  }

  params = utils.merge(params, {fullName:q});
  this.get("/familytree/v2/search", params, callback);
  return this;
}

/*
 * helpful utilities to retrieve the fssessionid cookie etc.
 */
FSApi.prototype.cookie = function (req) {
  // Fetch the cookie
  try {
    var fssessionid = JSON.parse(req.getSecureCookie(this.options.cookie));
  } catch (error) {
    var fssessionid = null;
  }
  return fssessionid;
}

FSApi.prototype.apiProxy = function () {
  return require('./apiProxy');
}

// User resources
FSApi.prototype.showUser = function (id, callback) {
  // Lookup will take a single id as well as multiple; why not just use it?
  var url = '/users/lookup.json',
    params = {}, ids = [], names = [];

  if (typeof id === 'string') {
    id = id.replace(/^\s+|\s+$/g, '');
    id = id.split(',');
  }

  // Wrap any stand-alone item in an array.
  id = [].concat(id);

  // Add numbers as userIds, strings as usernames.
  id.forEach(function (item) {
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

FSApi.prototype.searchUser = function (q, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = '/users/search.json';
  params = utils.merge(params, {q:q});
  this.get(url, params, callback);
  return this;
}
FSApi.prototype.searchUsers
  = FSApi.prototype.searchUser;


// Account resources

FSApi.prototype.validateSession = function (callback) {
  var url = '/identity/v2/session';
  this.get(url, null, callback);
  return this;
}

FSApi.prototype.calculatePublicHorizon = function (data) {
  var horizon = "";
  var map = this.createPedigreeMap(data);
  // console.log("calculatePublicHorizon map: ", map);
  if (data && data.pedigrees && data.pedigrees.length > 0
    && data.pedigrees[0].persons && data.pedigrees[0].persons.length > 0) {
    horizon = this.calculatePublicHorizonSlot(1, data.pedigrees[0].persons[0], map);
  }
  return horizon;
}

FSApi.prototype.calculatePublicHorizonSlot = function (slot, person, pedigreeMap) {
  // console.log("calculatePublicHorizonSlot begin",slot,person);
  var horizon = "",
    father, mother;

  if (!person) {
    return "";
  }
  if (person.properties && !person.properties.living) {
    horizon = person.id;
    if (slot > 1) {
      horizon += "(" + slot + ")";
    }
  } else if (person.parents && person.parents.length > 0) {
    var parents = this.calculateParents(person.parents[0].parent);
    // console.log("calculatePublicHorizonSlot for parents",parents);
    if (parents.father) {
      horizon += this.calculatePublicHorizonSlot(slot * 2, pedigreeMap[parents.father.id], pedigreeMap);
    }
    if (parents.mother) {
      horizon += "!" + this.calculatePublicHorizonSlot(slot * 2 + 1, pedigreeMap[parents.mother.id], pedigreeMap);
    }
    horizon = horizon.replace(/^!/, "").replace(/!$/, "");
  }
  // console.log("returning horizon: ",horizon);
  return horizon;
}

FSApi.prototype.createPedigreeMap = function (data) {
  var map = {};
  if (data && data.pedigrees && data.pedigrees.length > 0
    && data.pedigrees[0].persons && data.pedigrees[0].persons.length > 0) {
    var persons = data.pedigrees[0].persons;
    for (var i = persons.length - 1; i >= 0; i--) {
      map[persons[i].id] = persons[i];
    }
    ;
  }
  // console.dir(map);
  return map;
}

FSApi.prototype.calculateParents = function (parentArray) {
  // console.log("calculateParents:", parentArray);
  var results = {"father":null, "mother":null};
  if (parentArray && parentArray.length > 0) {
    if (parentArray[0].gender === "Female") {
      results.mother = parentArray[0];
    } else {
      results.father = parentArray[0];
    }
    if (parentArray.length === 2) {
      if (parentArray[1].gender === "Male" || parentArray[0].gender === "Female") {
        // swap if father is not first
        results.mother = parentArray[0];
        results.father = parentArray[1];
      } else if (parentArray[1].gender !== "Male") {
        results.mother = parentArray[1];
      }
    }
  }
  // console.log("calculateParents results:", results);
  return results;
}

