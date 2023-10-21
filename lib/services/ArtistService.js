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
      "select a.id, a.url_avatar, a.name, a.value_to_search from artist a ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          avatar: x.url_avatar,
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
      "select a.id, a.url_avatar, a.name, a.value_to_search from artist a limit 10";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (artist_10 = {
          id: x.id,
          avatar: x.url_avatar,
          name: x.name,
          value_to_search: x.value_to_search,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.GetAllArtist = GetAllArtist;
exports.Get10Artist = Get10Artist;
