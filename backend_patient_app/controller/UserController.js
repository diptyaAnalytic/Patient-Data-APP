const jwt = require("jsonwebtoken");

const { User } = require("../models");
const {SGKMS}  = require("../utils");
const { responseGet, responseError } = require("../helper/Response");
const { accessToken } = require('../helper/AccessToken')

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
      const randomNumbers = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/rng`,
        {
          sessionToken: process.env.SESSION_TOKEN,
          slotId: parseInt(process.env.SLOT_ID),
          length: 2,
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
          sessionToken: process.env.SESSION_TOKEN,
          slotId: parseInt(process.env.SLOT_ID),
        }
      ).then((data) => {
        console.log("masuk", data.result.sessionToken);
        process.env.SESSION_TOKEN = data.result.sessionToken;
      });
    } catch (error) {
      console.log("error refresh token");
    }
  }
}

module.exports = UserController;
