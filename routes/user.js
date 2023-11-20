var express = require("express");
var router = express.Router();
var UserService = require("../lib/services/UserService");
const { Constants } = require("../lib/constants/Constants");
var jwt = require("jsonwebtoken");

/* GET home page. */
router.post("/login", async function (req, res, next) {
  try {
    const account = req.body;
    const data = await UserService.Login(account);
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SERCET, {
      expiresIn: 100000000,
    });
    res.json({ accessToken }).status(200);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/me", function (req, res) {

})

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
