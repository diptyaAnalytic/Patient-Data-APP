require("dotenv").config();
const redis = require("redis");

console.log(process.env.PASSWORD_REDIS);
console.log(process.env.PORT_REDIS);

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: process.env.PORT_REDIS,
    password: process.env.PASSWORD_REDIS,
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