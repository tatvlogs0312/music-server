const express = require("express");
const router = express.Router();
const ArtistService = require("../lib/services/ArtistService");

router.get("/", function (req, res, next) {
  ArtistService.GetAllArtist()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

router.get("/limit", function (req, res, next) {
  ArtistService.Get10Artist()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

/**
 * API Lấy ca sĩ theo id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const data = await ArtistService.GetArtistDataByID(req.params.id);
    res.send(data).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

module.exports = router;
