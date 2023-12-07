const path = require("path");
const fs = require("fs");

/**
 * Lấy ảnh
 *
 * @param {*} fileName
 * @returns
 */
const getFileImage = (fileName) => {
  try {
    return path.join(__dirname, `../../public/images/data/${fileName}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Lấy ảnh
 *
 * @param {*} fileName
 * @returns
 */
const getAvatar = (fileName) => {
  try {
    let file = path.join(__dirname, `../../public/images/avatar/${fileName}`);
    if (fs.existsSync(file)) {
      return file;
    } 
    return path.join(__dirname, `../../public/images/avatar/user.png`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Lấy file mp3
 * 
 * @param {*} fileName 
 * @returns 
 */
const getFileMP3 = (fileName) => {
  try {
    return path.join(__dirname, `../../public/mp3/${fileName}`);
  } catch (error) {
    console.log(error);
  }
};

exports.getFileImage = getFileImage;
exports.getFileMP3 = getFileMP3;
exports.getAvatar = getAvatar;