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
      "select s.id, s.album_name, s.url_image_album   " +
      "order by s.create_at desc                      ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (album = {
          id: x.id,
          album_name: x.album_name,
          url_image_album: x.url_image_album,
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
    "select s.id, s.album_name, s.url_image_album   " +
    "order by s.create_at limit 10                  ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (album = {
            id: x.id,
            album_name: x.album_name,
            url_image_album: x.url_image_album,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};
