require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

const auth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.SECRET);
        if (payload) {
          req.user = payload;
          next();
        }
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ error: "Invalid token" });
      }
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json({ error: "Unauthorized request" });
  }
};

module.exports = {
  auth,
};
