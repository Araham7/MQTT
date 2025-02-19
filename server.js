const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1885;

server.listen(port, function () {
  console.log(`MQTT broker running on port ${port}`);
});

// Events for debugging
aedes.on('client', function (client) {
  console.log(`Client connected: ${client.id}`);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`Client disconnected: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(`Message from ${client.id}: ${packet.payload.toString()}`);
  }
});
