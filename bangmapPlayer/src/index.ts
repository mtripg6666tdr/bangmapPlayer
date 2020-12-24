import {onDeviceReady} from "./main";
import {CacheManager} from "./Common/CacheManager";

export class bangMapApp {
    _cacheManager:CacheManager;

    constructor(){
        this._cacheManager = new CacheManager();
    }

    run():void {
        onDeviceReady();
    }
}