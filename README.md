Asynchronous FamilySearch client API for node.js
===========================================

[fsapi](http://github.com/redbugz/node-fsapi) is a client library for accessing the [FamilySearch](https://familysearch.org) APIs from node.js

## Version 0.0.1

## Installation

You can install fsapi and its dependencies with npm: `npm install fsapi`.


## Getting started

Coming soon...

### Setup API 

The keys listed below can be obtained from [devnet.familysearch.org/](https://devnet.familysearch.org/).

	var FSApi = require('fsapi');

	var fsapi = new FSApi({
		consumer_key: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN'
	});


### REST API 

Note that all functions may be chained:

	fsapi
		.login(function (err, data) {
			console.log(console.dir(data));
		})
		.search('Theras Orson Allred',
			function (err, data) {
				console.log(console.dir(data));
			}
		);

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