require("dotenv").config(); // loading env variables

const errorHandler = async (error, req, res, next) => {
  const status = error.status || 400;
  res.status(status).json({ error: error.message });
};

module.exports = {
  errorHandler,
};
