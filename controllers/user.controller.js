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
    min: 8,
  }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = { status: 400, message: "Invalid parameters given" };
      return next(err);
    }

    const { username, password } = req.body;
    try {
      const signup = await userService.createUser({ username, password });
      if (signup.error) {
        const err = { status: 400, message: signup.error };
        return next(err);
      } else {
        res.status(httpStatus.CREATED).send();
      }
    } catch (error) {
      const err = { status: 400, message: "Error creating user" };
      return next(err);
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
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Invalid parameters given" });
    }
    try {
      const login = await userService.loginUser({ username, password });
      if (login.error) {
        const err = { status: 400, message: login.error };
        return next(err);
      } else {
        res.json({ token: login.token });
      }
    } catch (error) {
      const err = { status: 400, message: "Error creating user" };
      return next(err);
    }
  }
);

module.exports = router;
