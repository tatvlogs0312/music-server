const express = require("express");
const router = express.Router();
const SongService = require("../lib/services/SongService");

/* GET users listing. */
router.get("/", function (req, res, next) {
  SongService.GetSongData()
    .then((data) => res.send(data).status(200))
    .catch((error) => res.send(error).status(500));
});

router.put("/update-listen/:id", (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    SongService.UpdateListens(id)
    res.send().status(200)
  } catch(error) {
    res.send("Có lỗi xảy ra.").status(500)
  }
})

router.get("/search", (req, res, next) => {
  try {
    let keyword = req.query.keyword || '';
    let size = req.query.size || Number.MAX_SAFE_INTEGER;
  } catch (error) {
    res.send("Có lỗi xảy ra.").status(500)
  }
})

module.exports = router;
