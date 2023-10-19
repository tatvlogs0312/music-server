const db = require("../connections/ConnectDB");
const AlbumData = require("../models/AlbumData");

/**
 * Lấy tất cả album
 *
 * @returns
 */
const GetAllAlbum = async () => {
  try {
    const query =
      "select ab.id, ab.albums_name, ab.url_image_albums from albums ab";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (albums = {
          id: x.id,
          albums_name: x.albums_name,
          url_image_albums: x.url_image_albums,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy 10 album
 *
 * @returns
 */
const Get10Album = async () => {
  try {
    const query =
      "select ab.id, ab.albums_name, ab.url_image_albums from albums ab limit 10";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (albums = {
            id: x.id,
            albums_name: x.albums_name,
            url_image_albums: x.url_image_albums,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.GetAllAlbum = GetAllAlbum
exports.Get10Album = Get10Album