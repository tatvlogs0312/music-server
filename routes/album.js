const express = require("express");
const router = express.Router();
const AlbumService = require("../lib/services/AlbumService");

router.get("/", function (req, res, next) {
    AlbumService.GetAllAlbum()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

router.get("/limit", function (req, res, next) {
    AlbumService.Get10Album()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

module.exports = router;
