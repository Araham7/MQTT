// Required packages
const aedes = require("aedes")(); // MQTT broker
const http = require("http"); // HTTP server for Render
const ws = require("websocket-stream"); // WebSockets support
const port = process.env.PORT || 1885; // Use Render's port or default to 1885

// 🔐 Hardcoded authentication credentials
const USERS = {
  "araham": "12345", // First username-password
  "guest": "guestpass", // Second username-password
};

// ✅ Authentication logic
aedes.authenticate = function (client, username, password, callback) {
  if (!username || !password) {
    console.log(`❌ Authentication failed: Username or password missing`);
    return callback(new Error("Authentication failed: Missing credentials"), false);
  }

  const pass = password.toString(); // 🔄 Convert Buffer to String

  if (USERS[username] && USERS[username] === pass) {
    console.log(`✅ Client ${username} authenticated successfully`);
    callback(null, true);
  } else {
    console.log(`❌ Authentication failed for ${username}`);
    callback(new Error("Authentication failed: Invalid credentials"), false);
  }
};

// Create an HTTP server
const server = http.createServer();

// Attach WebSockets to the HTTP server and handle MQTT connections
ws.createServer({ server: server }, aedes.handle);

// Start the server
server.listen(port, () => {
  console.log(`MQTT server is running on ws://localhost:${port}`);
});

// Log client connections
aedes.on("client", (client) => {
  console.log(`✅ Client connected: ${client.id}`);
});

// Log client disconnections
aedes.on("clientDisconnect", (client) => {
  console.log(`❌ Client disconnected: ${client.id}`);
});

// Log published messages
aedes.on("publish", (packet, client) => {
  if (client) {
    console.log(`📤 Message from ${client.id} on topic ${packet.topic}: ${packet.payload.toString()}`);
  }
});

// Log client subscriptions
aedes.on("subscribe", (subscriptions, client) => {
  if (client) {
    console.log(`📡 Client ${client.id} subscribed to: ${subscriptions.map((s) => s.topic).join(", ")}`);
  }
});

// Log client unsubscriptions
aedes.on("unsubscribe", (topics, client) => {
  if (client) {
    console.log(`🚫 Client ${client.id} unsubscribed from: ${topics.join(", ")}`);
  }
});