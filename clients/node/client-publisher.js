var net = require('net');

var client = new net.Socket();
client.connect(1222, '192.168.43.80', function() {
	console.log('Connected');
	var inc = 0;
	setInterval(function() {
		client.write('{"command": "publish", "address": "1010", "value": ' + inc + '}\n');
		inc = inc + 1;
	}, 2500);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	var message = JSON.parse(data);
});

client.on('close', function() {
	console.log('Connection closed');
});
