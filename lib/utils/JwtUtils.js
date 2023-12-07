var jwt = require("jsonwebtoken");
const MException = require("../exception/MException");
const { Error } = require("../constants/Constants");

const getUserName = async (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new MException(Error.E_NOT_AUTHORIZATION, 401));
    } else {
      const jwtoken = token.replace("Bearer ", "");
      jwt.verify(jwtoken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
          reject(new MException(Error.E_NOT_AUTHORIZATION, 401));
        } else {
          const user = { id: data.id, email: data.email };
          resolve(user);
        }
      });
    }
  })
};

exports.getUserName = getUserName;
