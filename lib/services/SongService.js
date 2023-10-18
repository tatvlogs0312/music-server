const db = require("../connections/ConnectDB");
const SongData = require("../models/SongData");

const GetSong = async () => {
    try {
        const query =
            "select s.id, s.length, s.like_number, s.listens, s.name as song_name, n.name as national, s.year from song s        " +
            "left join national n on s.national_id = n.id                                               " +
            "order by s.create_time desc                                                                ";
        const result = await db.query(query);
        return result.rows.map((x) => song = {
            id: x.id,
            length: x.length,
            like_number: x.like_number,
            listens: x.listens,
            songName: x.song_name,
            national: x.national,
            year: x.year,
        });
    } catch (error) {
        throw error;
    }
}

exports.GetSong = GetSong