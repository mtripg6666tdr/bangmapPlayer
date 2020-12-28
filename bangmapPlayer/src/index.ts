import {CacheManager} from "./Common/CacheManager";
import {setFullScreen} from "./Util/setFullScreen";
import {isConnected} from "./Util/isInternetAvailable";
import { downloadFromURL } from "./Util/downloadFromURL";
import { ApiInfo } from "./Core/ApiInfo";

export default class bangMapApp {
    _cacheManager:CacheManager;
    Elements:{
        loadSongButton:HTMLElement,
        gamePlayButton:HTMLElement,
        showInfoButton:HTMLElement,
        closeInfoButton:HTMLElement,
        showPrefButton:HTMLElement,
        savePrefButton:HTMLElement,
        closePrefButton:HTMLElement,

        songIdTextBox:HTMLInputElement
    }

    constructor(){
        this.Elements = {
            loadSongButton: document.getElementById("load_song"),
            gamePlayButton: document.getElementById("game_play"),
            showInfoButton: document.getElementById("show_information"),
            closeInfoButton: document.getElementById("close_infoPanel_button"),
            showPrefButton: document.getElementById("show_preference_panel"),
            savePrefButton: document.getElementById("preference_save"),
            closePrefButton: document.getElementById("close_preference_button"),
            songIdTextBox: document.getElementById("song_id") as HTMLInputElement
        }

        this._cacheManager = new CacheManager();
    }

    run():void {
        setFullScreen();
        (document.getElementsByClassName("app")[0] as HTMLBodyElement).style.display = "none";
        this.init();
    }

    private async init(){
        if(isConnected()){
            const api = (await downloadFromURL("https://raw.githubusercontent.com/mtripg6666tdr/bangmapPlayer/apiinfo/apiinfo.json","json")) as ApiInfo;
            
        }
    }
}