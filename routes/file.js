var express = require("express");
const path = require("path");
var router = express.Router();
var FileService = require("../lib/services/FileService");

/* GET home page. */
router.get("/image/:filename", function (req, res, next) {
  const filePath = FileService.getFileImage(req.params.filename);
  res.sendFile(path.resolve(filePath));
});

module.exports = router;
