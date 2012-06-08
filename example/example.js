var FSApi = require('../index.js');

var fsapi = new FSApi({
	consumer_key: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN'
});
    
fsapi
	.login(function (err, data) {
		console.log(err, data);
        console.dir(data);
	});
	fsapi.search('Theras Orson Allred',
		function (err, data) {
			console.log(err, data); 
            console.dir(data);
		}
	);    