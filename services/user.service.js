require("dotenv").config(); // load .env variables
const User = require("../database/models/user");
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens

const createUser = async (userBody) => {
  const { username, password } = userBody;
  const checkUser = await User.findOne({ username: username });
  if (checkUser) {
    return { error: "User already exists" };
  }
  // hash the password
  userBody.password = await bcrypt.hash(password, 10);
  // create a new user
  const user = await User.create(userBody);
  if (!user) {
    return { error: "Error creating user" };
  }
  // send new user as response
  return user;
};

const loginUser = async (userBody) => {
  const { username, password } = userBody;
  const user = await User.findOne({ username: username });
  if (!user) {
    return { error: "User not found" };
  }
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (verifyPassword) {
    // sign token and send it in response
    const token = jwt.sign({ username: user.username }, process.env.SECRET);
    return { token };
  } else {
    return { error: "Invalid password" };
  }
};

module.exports = {
  createUser,
  loginUser,
};
