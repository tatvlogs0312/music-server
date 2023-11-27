var jwt = require("jsonwebtoken");
const MException = require("../exception/MException");
const { Error } = require("../constants/Constants");

const checkToken = (token) => {
  if (!token) {
    throw new MException(Error.E_NOT_AUTHORIZATION, 401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SERCET, (err, data) => {
        if (err) {
            throw new MException('Không có quyền truy cập', 403)
        }
    });
  }
};

exports.checkToken = checkToken;