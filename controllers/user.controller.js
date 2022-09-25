const { Router } = require("express");
const { userService } = require("../services");
const httpStatus = require("http-status");
const router = Router();

//Auth Routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "Missing username or password parameters" });
  }
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
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "Missing username or password parameters" });
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
});

module.exports = router;
