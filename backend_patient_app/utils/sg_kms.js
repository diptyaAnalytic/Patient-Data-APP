require("dotenv").config();
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");

const clientCert = fs.readFileSync(path.resolve(__dirname, "./sertifikat/postman.pem"));
const clientKey = fs.readFileSync(path.resolve(__dirname, "./sertifikat/csrprivatekey.key"));

const axiosInstance = axios.create({
  baseURL: process.env.URL_SGKMS,
  headers: {
    "Content-Type": "application/json",
  },
  httpsAgent: new https.Agent({
    cert: clientCert,
    key: clientKey,
    rejectUnauthorized: false,
  }),
});

class SGKMS {
    static async engineApiSGKMS(endpoint, payload) {
    try {
    //   console.log(endpoint)
    //   console.log(payload)
      const response = await axiosInstance.post(endpoint, payload);
    //   console.log(response.data)
      return response.data;
    } catch (err) {
      // console.log(err)
      return err.response.data; 
    }
  }
}


module.exports = SGKMS