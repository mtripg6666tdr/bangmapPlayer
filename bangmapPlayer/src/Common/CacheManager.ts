import { SongInfo } from "../Core/SongInfo";
import { Manager } from "./CommonBase";

export class CacheManager extends Manager {
    SongInfoCache = {} as {[key:number]:SongInfo};

    constructor(){
        super();
    }
}