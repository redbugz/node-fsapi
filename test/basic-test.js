var buster = require("buster");
var FSApi = require('../lib/fsapi');

buster.testCase("FSApi module basic tests", {
  "exists": function () {
    assert(FSApi);
  },
  "defaults are correct": function () {
      var fsapi = new FSApi();
      console.log("fsapi", fsapi);
      assert.equals("NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN", fsapi.options.developerKey, "incorrect default developer key");
      console.log("ua", fsapi.options.userAgent);
      assert.defined(fsapi.version, "version is undefined");
      assert.equals("node-fsapi/"+fsapi.version, fsapi.options.userAgent, "incorrect default user agent");
      assert.equals("https://api.familysearch.org", fsapi.options.referenceHost, "incorrect default reference host");
  },
  "defaults overrides work": function () {
      var devKey = "Test Dev Key";
      var ua = "Test User Agent/1.0-alpha.v1";
      var host = "http://fred:flintstone@example.com:8080";

      var fsapi = new FSApi({
          developerKey: devKey
      });
      assert.equals(devKey, fsapi.options.developerKey, "incorrect developer key");
      assert.equals("node-fsapi/"+fsapi.version, fsapi.options.userAgent, "incorrect default user agent");
      assert.equals("https://api.familysearch.org", fsapi.options.referenceHost, "incorrect default reference host");

      var fsapi = new FSApi({
          userAgent: ua
      });
      assert.equals("NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN", fsapi.options.developerKey, "incorrect default developer key");
      assert.equals(ua, fsapi.options.userAgent, "incorrect user agent");
      assert.equals("https://api.familysearch.org", fsapi.options.referenceHost, "incorrect default reference host");

      var fsapi = new FSApi({
          referenceHost: host
      });
      assert.equals("NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN", fsapi.options.developerKey, "incorrect default developer key");
      assert.equals("node-fsapi/"+fsapi.version, fsapi.options.userAgent, "incorrect user agent");
      assert.equals(host, fsapi.options.referenceHost, "incorrect reference host");

      var fsapi = new FSApi({
          developerKey: devKey,
          userAgent: ua,
          referenceHost: host
      });
      assert.equals(devKey, fsapi.options.developerKey, "incorrect developer key");
      assert.equals(ua, fsapi.options.userAgent, "incorrect user agent");
      assert.equals(host, fsapi.options.referenceHost, "incorrect reference host");
  }
});
