const db = require("../connections/ConnectDB");
const { Error } = require("../constants/Constants");
const MException = require("../exception/MException");
const Utils = require("../utils/Utils");
const MailService = require("../services/MailService");
const { query } = require("express");

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
      result.rows.forEach((x) => roles.push(x.role_name));
      data.roles = roles;
      return data;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Đăng kí tài khoản
 *
 * @param {*} reqest
 */
const Register = async (reqest) => {
  try {
    if (!Utils.validateEmail(reqest.email)) {
      throw new MException("Email không đúng định dạng", 400);
    } else if (!(await CheckEmailExist(reqest.email))) {
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

const ForgotPassword = async (reqest) => {
  try {
    if (await CheckEmailExist(reqest.email)) {
      throw new MException(Error.E_EMAIL_NOT_EXIST, 400);
    } else {
      const newPassword = Utils.RandomStr(8);
      const hashPassword = Utils.EncodeData(newPassword);
      updatePassword(reqest.email, hashPassword);
      MailService.sendMailChangePassword(reqest.email, newPassword);
    }
  } catch (error) {
    throw error;
  }
};

const updatePassword = (email, password) => {
  try {
    const sql = "update users set password = $1 where email = $2";
    const params = [password, email];
    db.query(sql, params);
  } catch (error) {
    throw error;
  }
};

const updateListenHistory = async (idSong, idUser) => {
  const sql1 =
    "select * from listen_history where song_id = $1 and user_id = $2";
  const params = [idSong, idUser];
  const result1 = await db.query(sql1, params);
  if (Number(result1.rowCount) > 0) {
    const sql2 =
      "update listen_history set listen_time = CURRENT_TIMESTAMP where song_id = $1 and user_id = $2";
    db.query(sql2, params);
  } else {
    const sql3 =
      "insert into listen_history (id, listen_time, song_id, user_id) values (nextval('listen_history_id_seq'), CURRENT_TIMESTAMP, $1, $2)";
    db.query(sql3, params);
  }
};

const ChangePassword = async (res) => {
  try {
    const sql = "update users set password = $1 where email = $2";
    const newPass = Utils.EncodeData(res.newPassword);
    const params = [newPass, res.email];
    await db.query(sql, params);
  } catch (error) {
    console.log(error);
  }
};

const GetSongHistory = async (id, page, size) => {
  const sql =
    "select s.id, s.name, s.url_mp3, s.url_image from listen_history lh join public.song s on s.id = lh.song_id where user_id = $1 order by lh.listen_time desc limit $2 offset $3;";
  const param = [id, size, size * page];
  const result = await db.query(sql, param);

  const ids = result.rows.map((x) => x.id);
  const artists1 = await GetArtistByListSong(ids);
  const songs = [];

  result.rows.forEach((x) => {
    const artistOfSong = artists1.filter((a) => a.songId === x.id);
    const artists = artistOfSong.map(
      (a) =>
        (artist = {
          id: a.id,
          name: a.name,
        })
    );

    const song = {
      id: x.id,
      songName: x.name,
      urlMp3: x.url_mp3,
      urlImage: x.url_image,
      artists: artists,
    };

    songs.push(song);
  });

  return songs;
};

const GetArtistByListSong = async (ids) => {
  try {
    const query =
      "select a.id, a.name, as2.song_id from artist a join artist_song as2 on a.id = as2.artist_id where as2.song_id = ANY($1::int[])";
    const params = [ids];

    const result = await db.query(query, params);
    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          name: x.name,
          songId: x.song_id,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.Login = Login;
exports.Register = Register;
exports.GetMe = GetMe;
exports.ForgotPassword = ForgotPassword;
exports.updateListenHistory = updateListenHistory;
exports.ChangePassword = ChangePassword;
exports.GetSongHistory = GetSongHistory;
