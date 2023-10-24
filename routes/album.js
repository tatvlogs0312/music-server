const express = require("express");
const router = express.Router();
const AlbumService = require("../lib/services/AlbumService");
const { Error } = require("../lib/constants/Constants");

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

/**
 * API lấy albums theo id
 */
router.get("/:id", async (req, res, next) => {
    try {
        const data = await AlbumService.GetAblumsDataByID(req.params.id);
        res.send(data).status(200);
    } catch (error) {
        console.log(error);
        res.send(Error.E_INTERNAL_ERROR).status(500);
    }
})

module.exports = router;
