require("dotenv").config();
const redis = require("redis");


const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
    password: "sandhiguna",
  },
});

client.on("connect", () => {
  console.log("Connected to Redis");
});
client.on("error", (err) => {
  console.error("Redis error:", err);
});
client.connect();

module.exports = client;