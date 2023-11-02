var express = require("express");
var router = express.Router();
var UserService = require("../lib/services/UserService");
const { Constants } = require("../lib/constants/Constants");

/* GET home page. */
router.post("/login", function (req, res, next) {
  res.send("OK").status(200);
});

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
