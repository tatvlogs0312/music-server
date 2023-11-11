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
const Get10Album = async (size) => {
  try {
    const query =
      "select ab.id, ab.albums_name, ab.url_image_albums from albums ab limit $1";
    const params = [size];
    const result = await db.query(query, params);
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

const GetAblumsDataByID = async (id) => {
  try {
    const albums = await GetAlbumsByID(id);
    const songs = await GetSongByAlbumsID(id);
    if (albums !== null) {
      let data = {
        id: albums.id,
        albumsName: albums.albumsName,
        urlImageAlbums: albums.urlImageAlbums,
        songs: songs,
      };
      return data;
    }

    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

/**
 * Lấy albums theo id
 *
 * @param {*} id
 * @returns
 */
const GetAlbumsByID = async (id) => {
  try {
    const query =
      "select a.id, a.albums_name, a.url_image_albums from albums a where a.id = $1";
    const params = [id];

    const result = await db.query(query, params);

    return {
      id: result.rows[0].id,
      albumsName: result.rows[0].albums_name,
      urlImageAlbums: result.rows[0].url_image_albums,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Lấy tất cả bài hát theo id albums
 *
 * @param {*} id
 * @returns
 */
const GetSongByAlbumsID = async (id) => {
  try {
    const query =
      "select s.id, s.name, s.url_image, s.url_mp3 from song s join albums_song as2 on s.id = as2.song_id where as2.albums_id = $1";
    const params = [id];

    const result = await db.query(query, params);
    let songs = result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          name: x.name,
          urlImage: x.url_image,
          urlMp3: x.url_mp3,
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

exports.GetAllAlbum = GetAllAlbum;
exports.Get10Album = Get10Album;
exports.GetAblumsDataByID = GetAblumsDataByID;
