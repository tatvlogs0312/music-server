const path = require("path");

const getFileImage = (fileName) => {
  try {
    return path.join(__dirname, `../../public/images/${fileName}`);
  } catch (error) {
    console.log(error);
  }
};

exports.getFileImage = getFileImage;
