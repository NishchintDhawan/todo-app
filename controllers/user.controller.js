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
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(httpStatus.BAD_REQUEST).json({ error: errors.mapped() });
    }
    const { username, password } = req.body;
    try {
      const signup = await userService.createUser({ username, password });
      if (signup.error) {
        res.status(httpStatus.BAD_REQUEST).json({ error: signup.error });
      } else {
        res.status(httpStatus.CREATED).send();
      }
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json({ error });
    }
  }
);

router.post(
  "/login",
  check("username", "Username is required").notEmpty(),
  check("password", "Password is required").notEmpty(),
  check("password", "Password cannot be less than 5 characters").isLength({
    min: 8,
  }),
  async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(httpStatus.BAD_REQUEST).json({ error: errors.mapped() });
    }
    try {
      const login = await userService.loginUser({ username, password });
      if (login.error) {
        res.status(httpStatus.BAD_REQUEST).json({ error: login.error });
      } else {
        res.json({ token: login.token });
      }
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json({ error });
    }
  }
);

module.exports = router;
