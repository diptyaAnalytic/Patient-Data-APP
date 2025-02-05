const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { SGKMS } = require("../utils");
const { responseGet, responseError } = require("../helper/Response");
const { accessToken } = require("../helper/AccessToken");
const {client, sessionToken} = require("../config/redis");

class UserController {
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({
        username: new RegExp(`^${username}$`, "i"),
      });
      if (!user || !(await user.comparePassword(password))) {
        return responseError(res, {
          message: !user ? "Username not found!" : "Invalid password!!",
        });
      }
      const login = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/agent/login`,
        {
          slotId: parseInt(process.env.SLOT_ID),
          password: process.env.PASSWORD_SGKMS,
        }
      );
      // console.log(login)
      if (!login.result.sessionToken) {
        return responseError(res, { message: "login sgkms failed!" });
      }
      await client.setEx(
        "session_token",
        14400, // 14400 ==> 4 jam
        `${login.result.sessionToken}`
      );


      const sessionToken = await client.get("session_token");
      console.log("ngambil sessionToken dari Redis:", sessionToken);
      const randomNumbers = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/rng`,
        {
          sessionToken: login.result.sessionToken,
          slotId: parseInt(process.env.SLOT_ID),
          length: parseInt(process.env.LENGTH_RNG),
        }
      );

      if (!randomNumbers)
        return responseError(res, { message: "engine sgkms error" });
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { code: randomNumbers.result.random.join("") } }
      );
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "5760m", //expaired 4 day
        }
      );
      responseGet(res, { accessToken: accessToken });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async fetch(req, res) {
    try {
      const token = accessToken(req);
      const data = await User.findOne({ _id: token.id }, "username");
      console.log(data);
      responseGet(res, data);
    } catch (error) {
      console.log(error);
    }
  }
  static async getUser(req, res) {
    try {
      const data = await User.find();
      return responseGet(res, data);
    } catch (error) {
      console.log(error);
    }
  }
  static async getKey(req, res) {
    try {
      const token = accessToken(req);
      const userCodes = await User.findOne({ _id: token.id }, "code");
      responseGet(res, userCodes);
    } catch (error) {
      responseError(res, error);
    }
  }
  static async refreshToken(req, res) {
    try {
      await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/agent/refreshSession`,
        {
          sessionToken: await sessionToken(),
          slotId: parseInt(process.env.SLOT_ID),
        }
      ).then(async (data) => {
        // console.log("masuk", data);
        await client.set("session_token", data.result.sessionToken, "KEEPTTL");

        const sessionToken = await client.get("session_token");
        console.log(
          "sessionToken Redis diperbarui dari refreshSession:",
          sessionToken
        );
      });
    } catch (error) {
      console.log("error refresh token", error);
    }
  }
  static async logout(req, res) {
    try {
      await redis.del(sessionToken);
    } catch (error) {
      responseError(res, error);
    }
  }
}

setInterval(async () => {
  if (await sessionToken()) {
    UserController.refreshToken();
  }
}, 300000); //5 menit

module.exports = UserController;
