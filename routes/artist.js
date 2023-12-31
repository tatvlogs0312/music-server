const express = require("express");
const router = express.Router();
const ArtistService = require("../lib/services/ArtistService");
const { Error } = require("../lib/constants/Constants");

router.get("/", function (req, res, next) {
  ArtistService.GetAllArtist()
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(500).send(error));
});

router.get("/limit", function (req, res, next) {
  ArtistService.Get10Artist()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.status(500).send(error));
});

/**
 * API Lấy ca sĩ theo id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const data = await ArtistService.GetArtistDataByID(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});
/**
 * API Lấy albums theo size
 */
router.get("/:id/albums", async (req, res, next) => {
  try {
    let size = req.query.size || '10000';
    const data = await ArtistService.GetAlbumByArtistIDSize(req.params.id,size);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});

/**
 * API Lấy bài hát theo size
 */
router.get("/:id/songs", async (req, res, next) => {
  try {
    let size = req.query.size || '20000';
    const data = await ArtistService.GetSongByArtistIDSize(req.params.id,size);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});
module.exports = router;
