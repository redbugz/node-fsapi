var winston = require('winston');
var logger = new (winston.Logger)({
  transports:[
    new (winston.transports.Console)({ level:'silly', colorize:true })/*,
     new (winston.transports.File)({ filename: 'somefile.log' })*/
  ]
});
var fsapi = require('../lib/fsapi')({
  developerKey:'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN',
  userAgent:"node-fsapi-example/0.1.0",
  referenceHost:"https://sandbox.familysearch.org"
});

logger.silly('start');

//console.dir(fsapi);
//console.log("fsapi:");//, fsapi, "FS", fsapi.FS, fsapi.FS.toString());
//console.dir(fsapi.FS);
//console.dir(fsapi.FS("session"));
//logger.silly("fsapi:", fsapi);
//logger.silly("fsapi:\n", fsapi);
//console.dir(fsapi);

logger.silly("fsapi login:");
//fsapi.login();

fsapi
  .validateSession(function (err, data) {
    logger.silly("verify: " + data);
    logger.silly("err: " + err);
  })
  .tree('' + fsapi.VERSION,
  function (err, data) {
    logger.silly("update: " + data);
    logger.silly("err: " + err);
  }
);

fsapi.search('Theras Orson Allred',
  function (err, data) {
    console.log(err, data);
    console.dir(data);
  }
);

//fsapi.search('nodejs OR #node', {}, function (err, data) {
//  logger.silly("search: " + data);
//  console.dir(data);
//  logger.silly("err: " + err);
//});