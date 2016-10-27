var net = require('net');

var client = new net.Socket();
client.connect(1222, '192.168.43.96', function() {
	console.log('Connected');
	setInterval(function() {
        var sendData = { "linear" : {"x":-10,"y":0,"z":0},"angular":{"x":0,"y":0,"z":5}}
        var send = {};
        send["Twist"]=sendData;
        client.write('{"command": "publish", "address": "1010", "value":'+JSON.stringify(send)+'}\n');
	}, 3000);
});
var pacNum = 0;
client.on('data', function(data) {
	console.log('Packet-' + pacNum + ' | Received: ' + data);
	pacNum = pacNum + 1;
});

client.on('close', function() {
	console.log('Connection closed');
});
