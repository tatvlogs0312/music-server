const express = require("express");
const router = express.Router();
const SongService = require("../lib/services/SongService");
const Utils = require("../lib/utils/Utils")
const { Error } = require("../lib/constants/Constants");

/**
 * API lấy tất cả bài hát
 */
router.get("/", function (req, res, next) {
  SongService.GetSongData()
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(500).send(error));
});

/**
 * API cập nhật lượt nghe
 */
router.put("/update-listen/:id", (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    SongService.UpdateListens(id)
    res.status(200).send();
  } catch(error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
})

/**
 * API tìm kiếm
 */
router.get("/search", async (req, res, next) => {
  try {
    let keyword = req.query.keyword || '';
    keyword = Utils.toValueSearch(keyword);
    const data = await SongService.Search(keyword);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
})

/**
 * API lấy tất cả bài hát nghe nhiều
 */
router.get("/top", async (req, res, next) => {
  try {
    let size = req.query.size;
    console.log(size);
    const data = await SongService.GetTopSongDataLimit(size);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});

/**
 * API lấy tất cả bài hát theo size
 */
router.get("/limit", async (req, res, next) => {
  try {
    let size = req.query.size || '12';
    console.log(size);
    const data = await SongService.GetSongDataLimit(size);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});

/**
 * API lấy bài hát theo ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const data = await SongService.GetSongDataByID(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(Error.E_INTERNAL_ERROR);
  }
});

module.exports = router;
