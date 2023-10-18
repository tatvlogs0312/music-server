const express = require("express");
const router = express.Router();
const SongService = require("../lib/services/SongService");

/* GET users listing. */
router.get("/", function (req, res, next) {
  SongService.GetSongData()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

module.exports = router;
