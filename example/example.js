var PORT = 3113;

var fsapi = require('../lib/fsapi')({
  developerKey: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN',
  userAgent: "node-fsapi-example-express/0.1.0",
  referenceHost: "https://sandbox.familysearch.org",
  callbackURL: "http://127.0.0.1:"+PORT+"/auth/familysearch/callback"
});

var express = require('express');

var app = express.createServer();
app.configure(function() {
  app.use(express.logger());
  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'something random'
  }));
  // fsapi middleware for session support, needs to come after express.session()
  fsapi.helpExpress(app);
});

app.get('/', function(req, res){
  if (req.user) {
    res.send('<html><body><p>Welcome, '+req.user.displayName+'</p><a href="logout">Sign Out of FamilySearch</a><br><hr><p>User:<br><pre>'+JSON.stringify(req.user)+'</pre></p><a href="tree">My Tree</a><br><a href="tree/KWQZ-838">William Savage Tree</a><br><a href="tree/KW31-NJ9">Theras Allred Tree</a><br><a href="search">Search</a></body></html>');
  } else {
    res.send('<html><body><a href="auth/familysearch">Sign In to FamilySearch</a><br><hr><p>User:<br><pre>'+JSON.stringify(req.user)+'</pre></p><p>These links will trigger authentication:</p><a href="tree">My Tree</a><br><a href="tree/KWQZ-838">William Savage Tree</a><br><a href="tree/KW31-NJ9">Theras Allred Tree</a><br><a href="search">Search</a></body></html>');
  }
});

app.get('/tree/:personId?', fsapi.requiresAuthentication, function(req, res){
  console.log('/tree', req.params.personId);

  var results= "no data\n";
  fsapi
      .tree(req.params.personId || "", {sessionId: req.user.sessionId},
      function (err, data) {
        console.log("tree error: ", err);
        console.log("tree result: ", data);
        results = JSON.stringify(data, null, 2);
        res.send('<html><body><p>Welcome, '+req.user.displayName+'</p><a href="logout">Sign Out of FamilySearch</a><br><hr><p>Tree Results:<br><pre>'+results+'</pre></p></body></html>');
      }
  );
});

app.get('/search', fsapi.requiresAuthentication, function(req, res) {
  console.log('/search');
  res.send('<html><body><p>Welcome, '+req.user.displayName+'</p><a href="logout">Sign Out of FamilySearch</a><br><hr><br><form action="search" method="post"><input type="text" name="searchName" value="Theras Allred"><input type="submit" value="Search"></form></body></html>');
});

app.post('/search', fsapi.requiresAuthentication, function(req, res) {
  console.log('post /search', req.body);

  var results= "no data\n";
  fsapi.search(req.body.searchName, {sessionId: req.user.sessionId},
      function (err, data) {
        console.log("search error:", err);
        console.log("search result:", data);
        results = "\nsearch results:\n"+JSON.stringify(data, null, 2);
        res.send('<html><body><p>Welcome, '+req.user.displayName+'</p><a href="logout">Sign Out of FamilySearch</a><br><hr><p>Results:<br><pre>'+results+'</pre></p></body></html>');
      }
  );

});

app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);

