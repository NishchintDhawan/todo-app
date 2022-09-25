const catcher = (callback, params, errorMessage) => {
  try {
    return callback(params);
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    };
  }
};

module.exports = {
  catcher,
};
