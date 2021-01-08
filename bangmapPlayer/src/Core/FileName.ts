import { DifficultyNames, SongID } from "./SongInfo";

export function getDetailedSongInfoFileName(id:SongID){
    return id.toString() + "d.json";
}
export function getSongBinaryFileName(id:SongID){
    return id.toString() + "b.mp3"
}
export function getMapFileName(id:SongID, diff:DifficultyNames){
    return id.toString() + "m" + diff + ".json"
}

export const songInfoCache = "sic_c.json";
export const downloadedSongInfo = "dsi_i.json";
export const historyInfo = "hist_i.json";
export const favoritesInfo = "fav_i.json";