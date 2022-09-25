require("dotenv").config(); // loading env variables

const errorHandler = async (err, req, res, next) => {
  const status = err.status || 400;
  const error = { error: err.message }
  res.status(status).send(error);
};

module.exports = {
  errorHandler,
};
