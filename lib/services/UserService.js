const db = require("../connections/ConnectDB");
const { Error } = require("../constants/Constants");
const MException = require("../exception/MException");
const Utils = require("../utils/Utils");
const MailService = require("../services/MailService")

const Login = async (account) => {
  try {
    const sql =
      "select id, email from users where email = $1 and password = $2";
    const params = [account.email, Utils.EncodeData(account.password)];
    const result = await db.query(sql, params);
    if (Number(result.rowCount) < 1) {
      throw new MException(Error.E_EMAIL_OR_PASSWORD_NOT_VALID, 400);
    } else {
      return { id: result.rows[0].id, email: result.rows[0].email };
    }
  } catch (error) {
    throw error;
  }
};

const GetMe = async (user) => {
  try {
    const sql =
      "select u.id, u.first_name, u.last_name, u.email, u.avatar_user, r.name as role_name from users u left join users_roles ur on u.id = ur.user_id join role r on ur.role_id = r.id where u.id = $1";
    const params = [user.id];
    const result = await db.query(sql, params);
    if (Number(result.rows[0].count) === 0) {
      throw new MException(Error.E_USER_NOT_EXIST, 400);
    } else {
      let data = {
        id: result.rows[0].id,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        email: result.rows[0].email,
        avatar: result.rows[0].avatar_user,
      };

      let roles = [];
      result.rows.forEach(x => roles.push(x.role_name));
      data.roles = roles
      return data;
    }
  } catch (err) {
    throw err;
  }
}

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
      Utils.EncodeData(reqest.password),
    ];
    await db.query(sql, params);

    const sql1 = "select id from users where email = $1";
    const params1 = [reqest.email];
    const result1 = await db.query(sql1, params1);
    const idUser = Number(result1.rows[0].id);

    const sql2 = "insert into users_roles (user_id, role_id) values ($1, 2)";
    const params2 = [idUser];
    await db.query(sql2, params2);
  } catch (error) {
    throw error;
  }
};

const ChangePassword = (reqest) => {
  try {
    MailService.sendMailChangePassword(reqest);
  } catch (error) {
    throw error;
  }
}

exports.Login = Login;
exports.Register = Register;
exports.GetMe = GetMe;
exports.ChangePassword = ChangePassword;