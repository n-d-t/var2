var net = require('net');


var client = new net.Socket();
client.connect(1222, '192.168.43.80', function() {
	console.log('Connected');
	client.write('{"command": "subscribe", "address": "1010"}\n');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	var message = JSON.parse(data);
});

client.on('close', function() {
	console.log('Connection closed');
});
