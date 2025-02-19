# Basic MQTT Server using `aedes` Module

This is a simple MQTT broker implementation using the `aedes` module. It includes basic authentication, event logging, and debugging capabilities.

## Code Implementation

```javascript
const dotenv = require("dotenv");
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);

dotenv.config();

const port = process.env.PORT || 1855;

server.listen(port, function () {
  console.log(`MQTT broker running on port ${port}`);
});

// Hardcoded authentication credentials
const USERS = {
  "araham": "12345",    // First username and password
  "guest": "guestpass", // Second username and password
};

// Authentication logic
aedes.authenticate = function (client, username, password, callback) {
  const pass = password ? password.toString() : null;

  if (USERS[username] && USERS[username] === pass) {
    console.log(`✅ Client ${username} authenticated successfully`);
    callback(null, true);
  } else {
    console.log(`❌ Client ${username} failed authentication`);
    callback(new Error("Authentication failed"), false);
  }
};

// Events for debugging
aedes.on('client', function (client) {
  console.log(`🔗 Client connected: ${client.id}`);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`🔌 Client disconnected: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(`📩 Message from ${client.id}: ${packet.payload.toString()}`);
  }
});

// Subscribe event tracking
aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log(`📡 Client ${client.id} subscribed to topics: ${subscriptions.map(s => s.topic).join(', ')}`);
  }
});

// Unsubscribe event tracking
aedes.on('unsubscribe', function (topics, client) {
  if (client) {
    console.log(`🚫 Client ${client.id} unsubscribed from topics: ${topics.join(', ')}`);
  }
});

# Dependencies
To install the required dependencies, run the following command:
```bash
npm install aedes dotenv nodemon
```

# Running the MQTT Server
Navigate to the project directory and run the following command to start the MQTT server:
```bash
npm run start
```

# MQTT Client Examples
Subscriber using `mosquitto_sub`
1. Subscribe with the first user:
```bash
mosquitto_sub -h localhost -p 1885 -t "test/topic" -u "araham" -P "12345"
```

2. Subscribe with the second user:
```bash
mosquitto_sub -h localhost -p 1885 -t "test/topic" -u "guest" -P "guestpass"
```

# Publisher using `mosquitto_pub`
Publish a message to the `test/topic` topic:
```bash
mosquitto_pub -h localhost -p 1885 -t "test/topic" -m "Hello MQTT" -u "araham" -P "12345"
```

> Notes:
> * Replace `1885` with the port number you are using if it differs.
> * Ensure `mosquitto` is installed on your system to use `mosquitto_sub` and `mosquitto_pub`.


# License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.