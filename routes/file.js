var express = require("express");
const path = require("path");
var router = express.Router();
var FileService = require("../lib/services/FileService");

/**
 * API lấy ảnh
 */
router.get("/image/:filename", function (req, res, next) {
  const filePath = FileService.getFileImage(req.params.filename);
  res.sendFile(path.resolve(filePath));
});

/**
 * API lấy ảnh
 */
router.get("/avatar/:filename", function (req, res, next) {
  const filePath = FileService.getAvatar(req.params.filename);
  res.sendFile(path.resolve(filePath));
});

/**
 * API lấy file mp3
 */
router.get("/mp3/:filename", function (req, res, next) {
  const filePath = FileService.getFileMP3(req.params.filename);
  res.sendFile(path.resolve(filePath));
});

module.exports = router;
