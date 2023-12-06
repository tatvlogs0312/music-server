var express = require("express");
var router = express.Router();
var UserService = require("../lib/services/UserService");
const { Constants } = require("../lib/constants/Constants");
var jwt = require("jsonwebtoken");
const JwtUtils = require("../lib/utils/JwtUtils");

/* GET home page. */
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

router.get("/me", function (req, res) {
  const token = req.headers["authorization"];
  const user = JwtUtils.getUserName(token);
  console.log(user);
  res.sendStatus(200)
});

function authenToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) res.sendStatus(403);
    console.log(err);
    next();
  });
}


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

module.exports = router;
