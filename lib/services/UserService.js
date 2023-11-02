const db = require("../connections/ConnectDB");
const { Error } = require("../constants/Constants");
const MException = require("../exception/MException");

const Login = async (account) => {};

/**
 * Đăng kí tài khoản
 *
 * @param {*} reqest
 */
const Register = async (reqest) => {
  try {
    if (!(await CheckEmailExist(reqest.email))) {
      throw new MException(Error.E_EMAIL_EXIST, 400);
    } else {
      await CreateAccount(reqest);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Check email đã tồn tại chưa
 *
 * @param {*} email
 * @returns
 */
const CheckEmailExist = async (email) => {
  try {
    const sql = "select count(*) from users where email = $1";
    const params = [email];
    const result = await db.query(sql, params);
    if (Number(result.rows[0].count) === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Tạo tài khoản mới
 *
 * @param {*} reqest
 */
const CreateAccount = async (reqest) => {
  try {
    const sql =
      "insert into users (id, first_name, last_name, email, password, avatar_user) values (nextval('users_id_seq'), $1, $2, $3, $4, 'avatar.png')";
    const params = [
      reqest.firstName,
      reqest.lastName,
      reqest.email,
      reqest.password,
    ];
    await db.query(sql, params);

    const sql1 = "select id from users where email = $1";
    const params1 = [reqest.email];
    const result1 = await db.query(sql1, params1);
    const idUser = Number(result1.rows[0].id);

    const sql2 = "insert into users_roles (user_id, role_id) values ($1, 1)";
    const params2 = [idUser];
    await db.query(sql2, params2);
  } catch (error) {
    throw error;
  }
};

exports.Login = Login;
exports.Register = Register;
