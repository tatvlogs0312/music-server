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
    return result.rows.map(x => artist = {
        id: x.id,
        name: x.name,
        song_id: x.song_id
    });
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
        let songs = await GetAllSong()
        let artists = await GetAllArtist()

        songs.forEach(s => {
            const artistsOfSong = artists.filter(a => s.id === a.song_id)
            console.log(artistsOfSong);
            s.artists = artistsOfSong
            console.log(songs);
        })

        return songs
    } catch(error) {
        console.log(error);
        throw error
    }
}

exports.GetSongData = GetSongData;