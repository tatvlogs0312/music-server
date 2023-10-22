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
      "select s.id, s.length, s.like_number, s.listens, s.name as song_name, n.name as national, s.year from song s        " +
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
      console.log(artistsOfSong);
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
    let query = "SELECT s.id, s.length, s.like_number, s.listens, s.name as song_name, s.year, s.url_image FROM song s WHERE 1 = 1";
    let params = [];
    if (keyword !== undefined && keyword !== '') {
      query += " and value_search like '%'||$1||'%'"
      params.push(keyword)
    }

    const result = await db.query(query, params);

    return result.rows.map((x) => 
      song = {
        id: x.id,
        length: x.length,
        likeNumber: x.like_number,
        listens: x.listens,
        songName: x.song_name,
        year: x.year,
        urlImage: x.url_image,
      }
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
    let params = []

    if (keyword !== undefined && keyword !== "") {
      query += " and a.value_to_search like '%'||$1||'%'";
      params.push(keyword);
    }

    const result = await db.query(query, params)

    return result.rows.map(x => 
      albums = {
        id: x.id,
        albumsName: x.albums_name,
        urlImageAlbums: x.url_image_albums,
      }
    )
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
    let query =
      "select a.id, a.name, a.url_avatar from artist a where 1 = 1";
    let params = [];
    if (keyword !== undefined && keyword !== "") {
      query += " and a.value_to_search like '%'||$1||'%'";
      params.push(keyword);
    }
    
    const result = await db.query(query, params)

    return result.rows.map(x => 
      artist = {
        id: x.id,
        name: x.name,
        urlAvatar: x.url_avatar
      }
    )
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

    let data = {
      id: song.id,
      name: song.name,
      urlImage: song.urlImage,
      artists: artists,
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
      "select a.id, a.name, a.url_image from song a where id = $1";
    const params = [id];

    const result = await db.query(query, params);

    const song = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      urlImage: result.rows[0].url_image,
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


exports.GetSongData = GetSongData;
exports.UpdateListens = UpdateListens;
exports.Search = Search;
exports.GetSongDataByID = GetSongDataByID;