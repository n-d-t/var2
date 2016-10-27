var net = require('net');

var packet = require("./packet.js");

var HOST = '192.168.43.96';
var PORT = 1222;

net.createServer(function(sock) {
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
  
  sock.packetBuffer = "";
  sock.pacNum = 0;

  function packetify(sock, data) {
    var buffer = sock.packetBuffer;

    if(buffer.length !== 0) {
      data = buffer + data;
    }

    var arr = data.split("\n");
    for(var i = 0; i < arr.length - 1; i++) {
        packet.emit('receive', sock, arr[i]);
    }

    buffer = arr[arr.length-1];
    sock.packetBuffer = buffer;
  }

  sock.on('data', function(data) {
    console.log("packet no - " + sock.pacNum);
    sock.pacNum += 1;
    packetify(sock, data.toString('utf8'));
  });

  sock.on('close', function(data) {
      console.log('CLOSED: ' + sock.remoteAddress +':'+ sock.remotePort);
  });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
