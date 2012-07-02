Asynchronous FamilySearch client API for Node.js
===========================================

[fsapi](http://github.com/redbugz/node-fsapi) is a client library for accessing the [FamilySearch](https://familysearch.org) APIs from Node.js

[![Build Status](https://secure.travis-ci.org/redbugz/node-fsapi.png)](http://travis-ci.org/redbugz/node-fsapi)

## Version 0.0.1

## Installation

You can install fsapi and its dependencies with npm: `npm install fsapi`.


## Getting started

Coming soon...

### Setup API 

The developerKey listed below can be obtained from [devnet.familysearch.org/](https://devnet.familysearch.org/).

	var FSApi = require('fsapi');

	var fsapi = new FSApi({
		developerKey: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN',
		userAgent: 'My Cool App/1.0'
	});


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

- oauth
- proxy
- search
- pedigree
- person read