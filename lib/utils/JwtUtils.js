var jwt = require("jsonwebtoken");
const MException = require("../exception/MException");
const { Error } = require("../constants/Constants");

const getUserName = (token) => {
  if (!token) {
    throw new MException(Error.E_NOT_AUTHORIZATION, 401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        console.log(err);
        throw new MException("Không có quyền truy cập", 403);
      } else {
        return data = {id: data.id, email: data.email};
      }
    });
  }
};

exports.getUserName = getUserName;
