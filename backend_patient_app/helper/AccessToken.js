const jwt = require("jsonwebtoken");

function accessToken(req) {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
    
  const accessToken = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error) return res.sendStatus(403);
      return decoded;
    }
  );
  return accessToken;
}

module.exports = { accessToken };
