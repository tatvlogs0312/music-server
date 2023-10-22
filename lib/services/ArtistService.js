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

/**
 * Lấy dữ liệu ca sĩ theo id
 *
 * @param {*} id
 * @returns
 */
const GetArtistDataByID = async (id) => {
  try {
    const artist = await GetArtistByID(id);
    const songs = await GetSongByArtistID(id);

    let data = {
      id: artist.id,
      name: artist.name,
      urlAvatar: artist.urlAvatar,
      songs: songs,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Lấy thông tin cơ bản ca sĩ
 *
 * @param {*} id
 * @returns
 */
const GetArtistByID = async (id) => {
  try {
    const query =
      "select a.id, a.name, a.url_avatar from artist a where id = $1";
    const params = [id];

    const result = await db.query(query, params);

    const artist = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      urlAvatar: result.rows[0].url_avatar,
    };

    return artist;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy tất cả bài hát theo id ca sĩ
 *
 * @param {*} id
 * @returns
 */
const GetSongByArtistID = async (id) => {
  try {
    const query =
      "select s.id, s.name, s.url_image from song s join artist_song as2 on s.id = as2.song_id join artist a on a.id = as2.artist_id where a.id = $1";
    const params = [id];

    const result = await db.query(query, params);
    let songs = result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          name: x.name,
          urlImage: x.url_image,
        })
    );

    const ids = songs.map((x) => x.id);
    const artists = await GetArtistByListSong(ids);
    songs.forEach((x) => {
      const artistOfSong = artists.filter((a) => a.songId === x.id);
      x.artists = artistOfSong.map(
        (a) =>
          (artist = {
            id: a.id,
            name: a.name,
          })
      );
    });

    return songs;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy ca sĩ theo danh sách id bài hát
 *
 * @param {*} ids
 * @returns
 */
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

exports.GetAllArtist = GetAllArtist;
exports.Get10Artist = Get10Artist;
exports.GetArtistDataByID = GetArtistDataByID;
