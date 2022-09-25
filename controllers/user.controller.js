const { Router } = require("express");
const { userService } = require("../services");
const httpStatus = require("http-status");
const { check, validationResult } = require("express-validator");
const router = Router();

//Auth Routes
router.post(
  "/signup",
  check("username", "Username is required").notEmpty(),
  check("password", "Password is required").notEmpty(),
  check("password", "Password cannot be less than 5 characters").isLength({
    min: 5,
  }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "Invalid parameters given",
      };
      return next(err);
    }

    const { username, password } = req.body;

    const signup = await userService.createUser({ username, password });
    if (signup.status >= httpStatus.BAD_REQUEST) {
      const err = { status: signup.status, message: signup.error };
      next(err);
    } else {
      res.status(httpStatus.CREATED).send();
    }
  }
);

router.post(
  "/login",
  check("username", "Username is required").notEmpty(),
  check("password", "Password is required").notEmpty(),
  check("password", "Password cannot be less than 4 characters").isLength({
    min: 4,
  }),
  async (req, res, next) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "Invalid parameters given",
      };
      return next(err);
    }

    const login = await userService.loginUser({ username, password });
    if (login.status >= httpStatus.BAD_REQUEST) {
      const err = { status: login.status, message: login.error };
      return next(err);
    } else {
      res.json({ token: login.token });
    }
  }
);

module.exports = router;
