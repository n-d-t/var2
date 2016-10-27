var fs = require('fs');
var path = require('path');
var events = require('events');
var packet = new events.EventEmitter();

var subDict = {};
var sockDict = {};

packet.on('receive', function(sock, packetData) {
  console.log('packetified from ' + sock.remoteAddress + ':' + sock.remotePort + ' ==> ' + packetData);
  packetData = JSON.parse(packetData);

  if(packetData.command === 'publish') {

    //writing the value in the address
    var address = packetData.address;
    var value = packetData.value;
    var fd = fs.openSync(path.join(__dirname + '/var/' + address + '.txt'), 'w+');
    fs.writeSync(fd, value);
    fs.closeSync(fd);

    packet.emit('broadcast', address, value);
  }

  else if(packetData.command === 'subscribe') {
    var address = packetData.address;
    packet.emit('subscribe', sock, address);
  }

  else if(packetData.command === 'fetch') {
    packet.emit('fetch', sock, packetData);
  }
  else if(packetData.command === 'unsubscribe'){
    packet.emit('unsubscribe',sock,packetData.address);
  }
  
});

packet.on('broadcast', function(address, value) {
  //code to broadcast the packetData to all the subscribers

  var packetData = {
      command : 'broadcast',
      address : address,
      value : value
  };

  var subArray = (subDict[address] === undefined) ? [] : subDict[address];
  subArray.forEach(function(sock) {
    console.dir(packetData);
    sock.write(JSON.stringify(packetData) + '\n');
    console.log('broadcasting to ' + sock.remoteAddress + ':' + sock.remotePort + ' ==> ' + JSON.stringify(packetData));
  });
});

packet.on('subscribe', function(sock, address) {
  //code to add sock object to subscriber list
  var subArray = (subDict[address]=== undefined) ? [] : subDict[address];
  
  subArray.push(sock);
  subDict[address]=subArray;

  console.log('subscribe req from ' + sock.remoteAddress + ':' + sock.remotePort + ' ==> '+ address);
});

packet.on('unsubscribe',function(sock, address) {
  var subArray = subDict[address];
  //console.log(address)
  for (var i = 0; i < subArray.length; i++){
    if((subArray[i].remoteAddress === sock.remoteAddress) && (subArray[i].remotePort === sock.remotePort))
    {
      subArray.splice(i,1);
      break;
    }
  }
  subDict[address]=subArray;
});

packet.on('fetch', function(sock, packetData) {
  //code to read the packetData from the file and do sock.write()
  var address = packetData.address;
  fs.readFile(path.join(__dirname + '/var/' + address + '.txt'), 'utf8', function(err, fileData) {
    if(!err) {
      packetData.value = fileData.toString();
    }
    sock.write(JSON.stringify(packetData) + '\n');
    console.log('fetch reply to ' + sock.remoteAddress + ':' + sock.remotePort + ' ==> ' + JSON.stringify(packetData));
  });

});

module.exports = packet;