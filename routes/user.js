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
    res.status(error.status || 500).send(error);
  }
});

router.put("/change-password", async (req, res) => {
  try {
    await UserService.ChangePassword(req.body);
    res.status(200).send();
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.put("/update-history", async (req, res) => {
  try {
    const { idSong, idUser } = req.body;
    await UserService.updateListenHistory(idSong, idUser);
    res.status(200).send();
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/history-list", async function (req, res) {
  try {
    const token = req.headers["authorization"];
    const user = await JwtUtils.getUserName(token);
    const page = req.query.page || 0;
    const size = req.query.size || 10;
    const me = await UserService.GetSongHistory(user.id, page, size);
    res.status(200).send(me);
  } catch (error) {
    res.status(error.status).send(error.msg);
  }
});

module.exports = router;
