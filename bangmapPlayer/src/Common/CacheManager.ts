import {SongInfo} from "../Core/SongInfo";

export class CacheManager {
    SongInfoCache = {} as {[key:number]:SongInfo};
}