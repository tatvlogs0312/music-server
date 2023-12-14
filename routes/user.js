var express = require("express");
var router = express.Router();
var UserService = require("../lib/services/UserService");
const { Constants } = require("../lib/constants/Constants");
var jwt = require("jsonwebtoken");
const JwtUtils = require("../lib/utils/JwtUtils");

/**
 * Login
 */
router.post("/login", async function (req, res, next) {
  try {
    const account = req.body;
    const data = await UserService.Login(account);
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 100000000,
    });
    res.json({ accessToken }).status(200);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

/**
 * Đăng kí tài khoản
 */
router.post("/register", async (req, res, next) => {
  try {
    const request = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    await UserService.Register(request);

    res.send(Constants.REGISTER_SUCCESS).status(200);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

/**
 * me
 */
router.get("/me", async function (req, res) {
  const token = req.headers["authorization"];
  const user = await JwtUtils.getUserName(token);
  const me = await UserService.GetMe(user);
  res.status(200).send(me);
});

/**
 * Đổi mật khẩu
 */
router.put("/forgot-password", async (req, res) => {
  try {
    await UserService.ForgotPassword(req.body);
    res.status(200).send();
  } catch (error) {
    res.status(error.status || 500).send(error)
  }
})

module.exports = router;
