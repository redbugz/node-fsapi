Asynchronous FamilySearch client API for Node.js
===========================================

[fsapi](http://github.com/redbugz/node-fsapi) is a client library for accessing the [FamilySearch](https://familysearch.org) APIs from Node.js

[![Build Status](https://secure.travis-ci.org/redbugz/node-fsapi.png)](http://travis-ci.org/redbugz/node-fsapi)

## Version 0.1.0

## Installation

You can install fsapi and its dependencies with npm by adding it to your package.json, or running `npm install fsapi`.

    "dependencies": {
      "fsapi": "0.1.0"
    }

## Getting started

There is a simple example Express application in the `example` directory. To run the example, you need to add your developer key in place of the `developerKey: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN'`, and then run:

    node example.js

You can test the app in your browser at http://127.0.0.1:3113/
Ig you want to run it on a different host, then update the `callbackURL: "http://127.0.0.1:"+PORT+"/auth/familysearch/callback"` to match where you are running it.

### Setup API 

The developerKey listed below can be obtained from [devnet.familysearch.org/](https://devnet.familysearch.org/).

    var FSApi = require('fsapi');

    var fsapi = require('../lib/fsapi')({
      developerKey: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN',
      userAgent: "node-fsapi-example-express/0.1.0",
      referenceHost: "https://sandbox.familysearch.org",
      callbackURL: "http://127.0.0.1:"+PORT+"/auth/familysearch/callback"
    });

The required parameters are `developerKey` and `callbackURL`, which must match the URL where your app can be reached.

If you leave referenceHost blank, it will default to https://api.familysearch.org

### REST API 

	fsapi.pedigree('KWC8-Q7X', function (err, data) {
    console.log(console.dir(data));
  });

### Search API 

	fsapi.search('Theras Orson Allred', function(err, data) {
		console.log(console.dir(data));
	});

## Contributors

- [redbugz](http://github.com/redbugz) - initial author

## TODO

- document the proxy
- search
- pedigree
- person read