import { CacheManager } from "./Common/CacheManager";
import { setFullScreen } from "./Util/setFullScreen";
import { isConnected } from "./Util/isInternetAvailable";
import { downloadFromURL } from "./Util/downloadFromURL";
import { ApiInfo } from "./Core/ApiInfo";
import { FileName } from "./Core/FileName";
import { FileUtil, resolveLocalFileSystemURL_s } from "./Util/fileUtil";
import { BestdoriAllBandInfo, BestdoriAllSongInfo, SongID, SongInfo } from "./Core/SongInfo";
import { ConvertFromBestdori } from "./Util/SongInfoConverter";
import { LocalSongIDListManager } from "./Common/LocalSongIDListManager";

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

        songIdTextBox:HTMLInputElement,

        filter_allRadio:HTMLInputElement,
        filter_dlRadio:HTMLInputElement,
        filter_historyRadio:HTMLInputElement,
        filter_favoriteRadio:HTMLInputElement,

        songList_all: HTMLElement,
        songList_dl: HTMLElement,
        songList_history: HTMLElement,
        songList_favorite: HTMLElement
    };
    private songInfos: SongInfo[];
    private apiInfo: ApiInfo;
    private dataDirectory:DirectoryEntry;
    private isOnline: boolean;
    private downloadedList: LocalSongIDListManager;
    private historyList: LocalSongIDListManager;
    private favoriteList: LocalSongIDListManager;

    constructor(){
        this.Elements = {
            loadSongButton: document.getElementById("load_song"),
            gamePlayButton: document.getElementById("game_play"),
            showInfoButton: document.getElementById("show_information"),
            closeInfoButton: document.getElementById("close_infoPanel_button"),
            showPrefButton: document.getElementById("show_preference_panel"),
            savePrefButton: document.getElementById("preference_save"),
            closePrefButton: document.getElementById("close_preference_button"),
            songIdTextBox: document.getElementById("song_id") as HTMLInputElement,
            filter_allRadio: document.getElementById("filter_all") as HTMLInputElement,
            filter_dlRadio: document.getElementById("filter_dl") as HTMLInputElement,
            filter_historyRadio: document.getElementById("filter_history") as HTMLInputElement,
            filter_favoriteRadio: document.getElementById("filter_favorite") as HTMLInputElement,
            songList_all: document.getElementById("songlist_all"),
            songList_dl: document.getElementById("songlist_dl"),
            songList_history: document.getElementById("songlist_history"),
            songList_favorite: document.getElementById("songlist_favorite")
        };

        this._cacheManager = new CacheManager();
        this.songInfos = null;
        this.apiInfo = null;
        this.dataDirectory = null;
        this.isOnline = isConnected();
        if(!this.isOnline){
            this.Elements.filter_allRadio.disabled = true;
            this.Elements.filter_dlRadio.checked = true;
            this.Elements.songList_all.style.display = "none";
            this.Elements.songList_dl.style.display = "block";
        }
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
        this.downloadedList = await new LocalSongIDListManager(this.dataDirectory, FileName.downloadedSongInfo).init();
        this.historyList = await new LocalSongIDListManager(this.dataDirectory, FileName.historyInfo).init();
        this.favoriteList = await new LocalSongIDListManager(this.dataDirectory, FileName.favoritesInfo).init();
    }
}