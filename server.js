const dotenv = require("dotenv");
const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);

dotenv.config();

const port = process.env.PORT || 1885;

server.listen(port, function () {
  console.log(`🚀 MQTT broker running on port ${port}`);
});

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

// 🎯 Debugging Events
aedes.on("client", (client) => console.log(`🔗 Client connected: ${client.id}`));
aedes.on("clientDisconnect", (client) => console.log(`🔌 Client disconnected: ${client.id}`));

aedes.on("publish", (packet, client) => {
  if (client) {
    console.log(`📩 Message from ${client.id}: ${packet.payload.toString()}`);
  }
});

aedes.on("subscribe", (subscriptions, client) => {
  if (client) {
    console.log(`📡 Client ${client.id} subscribed to: ${subscriptions.map((s) => s.topic).join(", ")}`);
  }
});

aedes.on("unsubscribe", (topics, client) => {
  if (client) {
    console.log(`🚫 Client ${client.id} unsubscribed from: ${topics.join(", ")}`);
  }
});
