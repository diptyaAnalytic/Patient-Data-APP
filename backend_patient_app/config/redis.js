require("dotenv").config();
const redis = require("redis");

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

const sessionToken =  async () => {
  const sessionToken = await client.get("session_token");
  return sessionToken
}

module.exports = { client, sessionToken };