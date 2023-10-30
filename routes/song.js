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
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

/**
 * API cập nhật lượt nghe
 */
router.put("/update-listen/:id", (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    SongService.UpdateListens(id)
    res.send().status(200)
  } catch(error) {
    console.log(error);
    res.send(Error.E_INTERNAL_ERROR).status(500);
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
    res.send(data).status(200);
  } catch (error) {
    console.log(error);
    res.send(Error.E_INTERNAL_ERROR).status(500);
  }
})

/**
 * API lấy tất cả bài hát
 */
router.get("/limit", async (req, res, next) => {
  try {
    let size = req.query.size || '12';
    console.log(size);
    const data = await SongService.GetSongDataLimit(size);
    res.send(data).status(200);
  } catch (error) {
    console.log(error);
    res.send(Error.E_INTERNAL_ERROR).status(500);
  }
});

/**
 * API lấy bài hát theo ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const data = await SongService.GetSongDataByID(req.params.id);
    res.send(data).status(200);
  } catch (error) {
    console.log(error);
    res.send(Error.E_INTERNAL_ERROR).status(500);
  }
});

module.exports = router;
