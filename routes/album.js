const express = require("express");
const router = express.Router();
const AlbumService = require("../lib/services/AlbumService");
const { Error } = require("../lib/constants/Constants");

router.get("/", function (req, res, next) {
    AlbumService.GetAllAlbum()
      .then((data) => res.status(200).send(data))
      .catch((error) => res.status(500).send(error));
});

router.get("/limit", function (req, res, next) {
    AlbumService.Get10Album()
      .then((data) => res.status(200).send(data))
      .catch((error) => res.status(500).send(error));
});

/**
 * API lấy albums theo id
 */
router.get("/:id", async (req, res, next) => {
    try {
        const data = await AlbumService.GetAblumsDataByID(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(Error.E_INTERNAL_ERROR);
    }
})

module.exports = router;
