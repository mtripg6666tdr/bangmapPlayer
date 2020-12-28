import { CacheManager } from "./Common/CacheManager";
import { setFullScreen } from "./Util/setFullScreen";
import { isConnected } from "./Util/isInternetAvailable";
import { downloadFromURL } from "./Util/downloadFromURL";
import { ApiInfo } from "./Core/ApiInfo";
import { FileName } from "./Core/FileName";
import { FileUtil, resolveLocalFileSystemURL_s } from "./Util/fileUtil";
import { BestdoriAllBandInfo, BestdoriAllSongInfo, SongID, SongInfo } from "./Core/SongInfo";
import { ConvertFromBestdori } from "./Util/SongInfoConverter";
import { SongListManager } from "./Common/SongListManager";

export default class bangMapApp {
    _cacheManager:CacheManager;
    private Elements:{
        loadSongButton:HTMLElement,
        gamePlayButton:HTMLElement,
        showInfoButton:HTMLElement,
        closeInfoButton:HTMLElement,
        showPrefButton:HTMLElement,
        savePrefButton:HTMLElement,
        closePrefButton:HTMLElement,

        songIdTextBox:HTMLInputElement
    };
    private songInfos: SongInfo[];
    private apiInfo: ApiInfo;
    private dataDirectory:DirectoryEntry;
    private isOnline: boolean;
    private downloadedList: SongListManager;
    private historyList: SongListManager;
    private favoriteList: SongListManager;

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
        this.songInfos = null;
        this.apiInfo = null;
        this.dataDirectory = null;
        this.isOnline = isConnected();
    }

    run():void {
        setFullScreen();
        (document.getElementsByClassName("app")[0] as HTMLBodyElement).style.display = "none";
        this.init();
    }

    private async init(){
        // get directory entry
        this.dataDirectory = await resolveLocalFileSystemURL_s(cordova.file.dataDirectory);

        if(this.isOnline){
            // get api info
            this.apiInfo = (await downloadFromURL("https://raw.githubusercontent.com/mtripg6666tdr/bangmapPlayer/apiinfo/apiinfo.json","json")) as ApiInfo;
            
            // get song info from network
            const BsongInfo = (await downloadFromURL(this.apiInfo.allSongInfo, "json")) as BestdoriAllSongInfo;
            const BbandInfo = (await downloadFromURL(this.apiInfo.bandInfo   , "json")) as BestdoriAllBandInfo;
            this.songInfos = ConvertFromBestdori(BsongInfo, BbandInfo);
            // save song info
            await new FileUtil(this.dataDirectory, FileName.songInfoCache).writeText(JSON.stringify(this.songInfos));
        }else{
            // check if cache exists
            const songInfoFile = new FileUtil(this.dataDirectory, FileName.songInfoCache);
            if(songInfoFile.exists()){
                // get song info from network
                this.songInfos = JSON.parse(await songInfoFile.readText());
            }else{
                // Can't run app; need network in first launch
            }
        }

        // get each list
        this.downloadedList = await new SongListManager(this.dataDirectory, FileName.downloadedSongInfo).init();
        this.historyList = await new SongListManager(this.dataDirectory, FileName.historyInfo).init();
        this.favoriteList = await new SongListManager(this.dataDirectory, FileName.favoritesInfo).init();
    }
}