const db = require("../connections/ConnectDB");
const ArtistData = require("../models/ArtistData");

/**
 * Lấy tất cả ca sĩ
 *
 * @returns
 */
const GetAllArtist = async () => {
  try {
    const query =
      "select s.id, s.avatar, s.name, s.value_to_search   " +
      "order by s.create_date desc                        ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          avatar: x.avatar,
          name: x.name,
          value_to_search: x.value_to_search,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy 10 ca sĩ
 *
 * @returns
 */
const Get10Artist = async () => {
  try {
    const query =
      "select s.id, s.avatar, s.name, s.value_to_search   " +
      "order by s.create_date LIMIT 10                    ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (artist_10 = {
          id: x.id,
          avatar: x.avatar,
          name: x.name,
          value_to_search: x.value_to_search,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.GetAllArtist = GetAllArtist
exports.Get10Artist = Get10Artist