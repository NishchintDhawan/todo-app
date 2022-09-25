require("dotenv").config(); // load .env variables
const User = require("../database/models/user");
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const httpStatus = require("http-status");
const { error } = require("../utils");

const createUser = (userBody) => {
  return error.catcher(
    async (userBody) => {
      const { username, password } = userBody;
      const checkUser = await User.findOne({ username: username });
      if (checkUser) {
        return { status: httpStatus.BAD_REQUEST, error: "User already exists" };
      }

      userBody.password = await bcrypt.hash(password, 10);

      const user = await User.create(userBody);
      if (!user) {
        return { status: httpStatus.BAD_REQUEST, error: "Error creating user" };
      }
      return user;
    },
    userBody,
    "Error creating user"
  );
};

const loginUser = (userBody) => {
  return error.catcher(
    async (userBody) => {
      const { username, password } = userBody;
      const user = await User.findOne({ username: username });

      if (!user) {
        return { status: httpStatus.BAD_REQUEST, error: "User not found" };
      }

      const verifyPassword = await bcrypt.compare(password, user.password);

      if (verifyPassword) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        return { token };
      } else {
        return { status: httpStatus.BAD_REQUEST, error: "Invalid password" };
      }
    },
    userBody,
    "Error logging in user"
  );
};
module.exports = {
  createUser,
  loginUser,
};
