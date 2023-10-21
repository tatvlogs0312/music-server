const path = require("path");

/**
 * Lấy ảnh
 *
 * @param {*} fileName
 * @returns
 */
const getFileImage = (fileName) => {
  try {
    return path.join(__dirname, `../../public/images/${fileName}`);
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
