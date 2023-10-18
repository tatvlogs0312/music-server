const express = require("express");
const router = express.Router();
const SongService = require("../lib/services/SongService");

/* GET users listing. */
router.get("/", function (req, res, next) {
  SongService.GetSong()
    .then((data) => res.send(data).status(200))
    .catch((error) => {
      console.log(error);
      res.send({ error: error.code, message: "Có lỗi xảy ra!" }).status(500);
    });
});

module.exports = router;
