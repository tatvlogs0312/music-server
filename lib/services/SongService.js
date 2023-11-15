const db = require("../connections/ConnectDB");
const SongData = require("../models/SongData");

/**
 * Lấy tất cả bài hát
 *
 * @returns
 */
const GetAllSong = async () => {
  try {
    const query =
      "select s.id, s.length, s.like_number, s.listens, s.name as song_name, n.name as national, s.year, s.url_image from song s        " +
      "left join national n on s.national_id = n.id                                               " +
      "order by s.create_time desc                                                                ";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          length: x.length,
          like_number: x.like_number,
          listens: x.listens,
          songName: x.song_name,
          national: x.national,
          year: x.year,
          urlImage: x.url_image,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy tất cả ca sĩ
 *
 * @returns
 */
const GetAllArtist = async () => {
  try {
    const query =
      "SELECT a.id as id, a.name as name, as2.song_id as song_id from artist a JOIN artist_song as2 ON a.id = as2.artist_id";
    const result = await db.query(query);
    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          name: x.name,
          song_id: x.song_id,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy dữ liệu đầy đủ của bài hát đã bao gồm tên ca sĩ
 *
 * @returns
 */
const GetSongData = async () => {
  try {
    let songs = await GetAllSong();
    let artists = await GetAllArtist();

    songs.forEach((s) => {
      const artistsOfSong = artists.filter((a) => s.id === a.song_id);
      s.artists = artistsOfSong;
    });

    return songs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Update số lần nghe của bài hát
 *
 * @param {*} id
 */
const UpdateListens = (id) => {
  try {
    const query =
      "UPDATE song SET listens = (SELECT listens from song WHERE id = $1) + 1 WHERE id = $1";
    const params = [id];

    db.query(query, params);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Function trả về data tìm kiếm
 * @param {*} keyword
 * @returns
 */
const Search = async (keyword) => {
  try {
    let songs = await SearchSong(keyword);
    let artists = await SearchArtist(keyword);
    let albums = await SearchAlbums(keyword);

    data = {
      songs: songs,
      artists: artists,
      albums: albums,
    };

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tìm kiếm bài hát theo keyword
 * @param {*} keyword
 * @returns
 */
const SearchSong = async (keyword) => {
  try {
    let query =
      "SELECT s.id, s.length, s.like_number, s.listens, s.name as song_name, s.year, s.url_image FROM song s WHERE 1 = 1";
    let params = [];
    if (keyword !== undefined && keyword !== "") {
      query += " and value_search like '%'||$1||'%'";
      params.push(keyword);
    }

    const result = await db.query(query, params);

    return result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          length: x.length,
          likeNumber: x.like_number,
          listens: x.listens,
          songName: x.song_name,
          year: x.year,
          urlImage: x.url_image,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Tìm kiếm albums theo keyword
 * @param {*} keyword
 * @returns
 */
const SearchAlbums = async (keyword) => {
  try {
    let query =
      "select a.id, a.albums_name, a.url_image_albums from albums a where 1 = 1";
    let params = [];

    if (keyword !== undefined && keyword !== "") {
      query += " and a.value_to_search like '%'||$1||'%'";
      params.push(keyword);
    }

    const result = await db.query(query, params);

    return result.rows.map(
      (x) =>
        (albums = {
          id: x.id,
          albumsName: x.albums_name,
          urlImageAlbums: x.url_image_albums,
        })
    );
  } catch (error) {
    // console.log(error);
    return [];
  }
};

/**
 * Tìm kiếm ca sĩ theo keyword
 * @param {*} keyword
 * @returns
 */
const SearchArtist = async (keyword) => {
  try {
    let query = "select a.id, a.name, a.url_avatar from artist a where 1 = 1";
    let params = [];
    if (keyword !== undefined && keyword !== "") {
      query += " and a.value_to_search like '%'||$1||'%'";
      params.push(keyword);
    }

    const result = await db.query(query, params);

    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          name: x.name,
          urlAvatar: x.url_avatar,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy bài hát theo ID
 */
const GetSongDataByID = async (id) => {
  try {
    const song = await GetSongByID(id);
    const artists = await GetArtistsBySongID(id);
    const albums = await GetAlbumsBySongID(id);

    let data = {
      id: song.id,
      name: song.name,
      urlImage: song.urlImage,
      urlMp3: song.urlMp3,
      artists: artists,
      albums: albums,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const GetSongByID = async (id) => {
  try {
    const query =
      "select a.id, a.name, a.url_image, a.url_mp3 from song a where id = $1";
    const params = [id];

    const result = await db.query(query, params);

    const song = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      urlImage: result.rows[0].url_image,
      urlMp3: result.rows[0].url_mp3,
    };

    return song;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy các ca sĩ có trong bài hát
 */
const GetArtistsBySongID = async (id) => {
  try {
    const query =
      "select s.id, s.name, s.url_avatar from artist s join artist_song as2 on s.id = as2.artist_id join song a on a.id = as2.song_id where a.id = $1";
    const params = [id];

    const result = await db.query(query, params);
    return result.rows.map(
      (x) =>
        (artist = {
          id: x.id,
          name: x.name,
          urlAvatar: x.url_avatar,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

const GetAlbumsBySongID = async (id) => {
  try {
    const query =
      "select a.id, a.albums_name, a.url_image_albums from albums a join albums_song as2 on a.id = as2.albums_id where as2.song_id = $1";
    const params = [id];

    const result = await db.query(query, params);
    return result.rows.map(
      (x) =>
        (albums = {
          id: x.id,
          albumsName: x.albums_name,
          urlImageAlbums: x.url_image_albums,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy danh sách nhạc nghe nhiều
 */
const GetTopSongDataLimit = async (size) => {
  try {
    const songs = await GetTopSongBySize(size);
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
 * Lấy song theo số lượng
 *
 * @param {*} size
 * @returns
 */
const GetTopSongBySize = async (size) => {
  try {
    let query =
      "select s.id, s.length, s.like_number, s.listens, s.name as song_name, n.name as national, s.year, s.url_image from song s\n" +
      "left join national n on s.national_id = n.id       \n" +
      "order by s.listens desc \n";
      
    let params = [];

    if (size) {
      query += "limit $1";
      params.push(size)
    }

    const result = await db.query(query, params);

    return result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          length: x.length,
          like_number: x.like_number,
          listens: x.listens,
          songName: x.song_name,
          national: x.national,
          year: x.year,
          urlImage: x.url_image,
        })
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Lấy danh sách nhạc theo số lượng
 */
const GetSongDataLimit = async (size) => {
  try {
    const songs = await GetSongBySize(size);
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
 * Lấy song theo số lượng
 *
 * @param {*} size
 * @returns
 */
const GetSongBySize = async (size) => {
  try {
    const query =
      "select s.id, s.length, s.like_number, s.listens, s.name as song_name, n.name as national, s.year, s.url_image from song s\n" +
      "left join national n on s.national_id = n.id       \n" +
      "order by s.create_time desc\n" +
      "limit $1";
    const params = [size];

    const result = await db.query(query, params);

    return result.rows.map(
      (x) =>
        (song = {
          id: x.id,
          length: x.length,
          like_number: x.like_number,
          listens: x.listens,
          songName: x.song_name,
          national: x.national,
          year: x.year,
          urlImage: x.url_image,
        })
    );
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

exports.GetSongData = GetSongData;
exports.UpdateListens = UpdateListens;
exports.Search = Search;
exports.GetSongDataByID = GetSongDataByID;
exports.GetSongDataLimit = GetSongDataLimit;
exports.GetTopSongDataLimit = GetTopSongDataLimit;