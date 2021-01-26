import { Spinner } from "spin.js";
import { toGameContent } from "./bangbangboom-editor/MapFormats/bbbgame";
import { fromBBBv1Format } from "./bangbangboom-editor/MapFormats/bbbv1";
import { CacheManager } from "./Common/CacheManager";
import { GameStart } from "./Common/GameStarter";
import { SongListAdapter } from "./Common/ListAdapter";
import { LocalSongIDListManager } from "./Common/LocalSongIDListManager";
import { PreferenceDataManager } from "./Common/PreferenceDataManager";
import { SongInfoContainerManager } from "./Common/SongInfoContainerManager";
import { ApiInfo } from "./Core/ApiInfo";
import * as FileName from "./Core/FileName";
import { BestdoriAllBandInfo, BestdoriAllSongInfo, BestdoriSingleSongInfo, DetailedSongInfoInner, DifficultyNames, SongID, SongInfo, SongInfoInner } from "./Core/SongInfo";
import { spinnerOpts } from "./Core/SpinnerOpts";
import { bangMapAppElements, initBangmapAppElements } from "./Util/bangmapAppElements";
import { downloadFromURL } from "./Util/downloadFromURL";
import { FileUtil, resolveLocalFileSystemURL_s } from "./Util/fileUtil";
import { isConnected } from "./Util/isInternetAvailable";
import { setFullScreen } from "./Util/setFullScreen";
import { ConvertFromBestdori, ConvertFromBestdoriSingleSongInfo, GetSongID } from "./Util/SongInfoConverter";
import { ComplementZero } from "./Util/ZeroComplement";

export default class bangMapApp {
    _cacheManager:CacheManager;
    private Elements: bangMapAppElements
    // Song Info
    private songInfos: SongInfo;
    private songids: SongID[];
    
    private apiInfo: ApiInfo;
    private dataDirectory:DirectoryEntry;
    private isOnline: boolean;
    // ID List Manager
    private downloadedList: LocalSongIDListManager;
    private historyList: LocalSongIDListManager;
    private favoriteList: LocalSongIDListManager;
    // Element Manager
    private songinfoContainerManager: SongInfoContainerManager;
    // Preference Data Manager
    private preferenceDataManager: PreferenceDataManager
    // Adapter
    private allSongAdapter: SongListAdapter;
    private dlSongAdapter: SongListAdapter;
    private historySongAdapter: SongListAdapter;
    private favoriteSongAdapter: SongListAdapter;

    constructor(){
        this.Elements = initBangmapAppElements();

        this._cacheManager = new CacheManager();
        this.songinfoContainerManager = new SongInfoContainerManager(this.Elements);
        this.preferenceDataManager = new PreferenceDataManager();
        this.songInfos = null;
        this.apiInfo = null;
        this.dataDirectory = null;
        this.isOnline = isConnected();
        if(!this.isOnline){
            this.Elements.Filter.allRadio.disabled = true;
            this.Elements.Filter.dlRadio.checked = true;
            this.Elements.Fragment.songList_all.style.display = "none";
            this.Elements.Fragment.songList_dl.style.display = "block";
        }
    }

    async run():Promise<void> {
        const spinner = this.runSpin();
        setFullScreen();
        (document.getElementsByClassName("app")[0] as HTMLBodyElement).style.display = "none";
        await this.init();
        this.setEventHandlers();
        this.stopSpin();
    }

    //
    // Spinner
    //
    private _spinner:Spinner;
    runSpin() {
        document.getElementById("spinner_back").style.display = "block";
        return this._spinner?.spin(document.getElementById("spinner")) ?? (this._spinner = new Spinner(spinnerOpts).spin(document.getElementById("spinner")));
    }

    stopSpin(){
        this._spinner.stop();
        document.getElementById("spinner_back").style.display = "none";
    }

    //
    // Private Member Method
    //
    private async init(){
        // get directory entry
        this.dataDirectory = await resolveLocalFileSystemURL_s(cordova.file.dataDirectory);

        if(this.isOnline){
            // get api info
            
            const data_url = "https://raw.githubusercontent.com/mtripg6666tdr/bangmapPlayer/apiinfo/apiinfo.json";
            // @ts-ignore
            //const data_url = (function(){var _0x37d7=['\x65\x5a\x70','\x63\x54\x45','\x63\x6f\x6e','\x73\x74\x72','\x75\x63\x74','\x64\x65\x62','\x61\x70\x70','\x73\x74\x61','\x62\x6a\x65','\x66\x75\x6e','\x63\x74\x69','\x6f\x6e\x20','\x20\x2a\x5c','\x5c\x2b\x5c','\x28\x3f\x3a','\x5b\x61\x2d','\x7a\x41\x2d','\x5a\x5f\x24','\x5d\x5b\x30','\x2d\x39\x61','\x2d\x7a\x41','\x24\x5d\x2a','\x69\x6e\x69','\x74\x65\x73','\x63\x68\x61','\x69\x6e\x70','\x57\x74\x71','\x68\x74\x74','\x70\x73\x3a','\x2f\x2f\x72','\x61\x77\x2e','\x67\x69\x74','\x68\x75\x62','\x75\x73\x65','\x6e\x74\x65','\x6e\x74\x2e','\x63\x6f\x6d','\x2f\x6d\x74','\x67\x36\x36','\x36\x36\x74','\x64\x72\x2f','\x62\x61\x6e','\x67\x6d\x61','\x70\x50\x6c','\x61\x79\x65','\x6e\x66\x6f','\x2f\x61\x70','\x69\x69\x6e','\x66\x6f\x2e','\x6a\x73\x6f','\x69\x6e\x67','\x77\x68\x69','\x6c\x65\x20','\x28\x74\x72','\x75\x65\x29','\x63\x6f\x75','\x65\x4e\x79','\x58\x4e\x48','\x6c\x65\x6e','\x67\x74\x68','\x67\x67\x65','\x63\x61\x6c','\x69\x6f\x6e','\x74\x65\x4f','\x55\x78\x61','\x72\x61\x75'];var _0x2f58=function(_0x561782,_0x4c242c){_0x561782=_0x561782-0x104;var _0x5b5a5c=_0x37d7[_0x561782];return _0x5b5a5c;};var _0x4eb23c=_0x2f58,_0x1b3440=function(){var _0x14b6a4=!![];return function(_0x31af1b,_0x2b50f3){var _0x414137=_0x14b6a4?function(){var _0x1d502c=_0x2f58;if(_0x1d502c(0x104)+'\x4f\x53'!==_0x1d502c(0x105)+'\x79\x71'){if(_0x2b50f3){var _0x314ce9=_0x2b50f3['\x61\x70\x70'+'\x6c\x79'](_0x31af1b,arguments);return _0x2b50f3=null,_0x314ce9;}}else{function _0x1144e8(){var _0x5c529a=_0x1d502c;(function(){return![];}[_0x5c529a(0x106)+_0x5c529a(0x107)+_0x5c529a(0x108)+'\x6f\x72'](_0x5c529a(0x109)+'\x75'+('\x67\x67\x65'+'\x72'))[_0x5c529a(0x10a)+'\x6c\x79'](_0x5c529a(0x10b)+'\x74\x65\x4f'+_0x5c529a(0x10c)+'\x63\x74'));}}}:function(){};return _0x14b6a4=![],_0x414137;};}();(function(){_0x1b3440(this,function(){var _0x20e16b=_0x2f58,_0x1fd76d=new RegExp(_0x20e16b(0x10d)+_0x20e16b(0x10e)+_0x20e16b(0x10f)+'\x2a\x5c\x28'+_0x20e16b(0x110)+'\x29'),_0x395bca=new RegExp(_0x20e16b(0x111)+'\x2b\x20\x2a'+_0x20e16b(0x112)+_0x20e16b(0x113)+_0x20e16b(0x114)+_0x20e16b(0x115)+_0x20e16b(0x116)+_0x20e16b(0x117)+_0x20e16b(0x118)+'\x2d\x5a\x5f'+_0x20e16b(0x119)+'\x29','\x69'),_0x38395a=_0x5b5a5c(_0x20e16b(0x11a)+'\x74');if(!_0x1fd76d[_0x20e16b(0x11b)+'\x74'](_0x38395a+(_0x20e16b(0x11c)+'\x69\x6e'))||!_0x395bca[_0x20e16b(0x11b)+'\x74'](_0x38395a+(_0x20e16b(0x11d)+'\x75\x74'))){if(_0x20e16b(0x11e)+'\x6c\x46'===_0x20e16b(0x11e)+'\x6c\x46')_0x38395a('\x30');else{function _0x45fd8e(){var _0x3388d9=_0x142b23?function(){var _0x406a06=_0x2f58;if(_0x5a14cf){var _0x3271c8=_0x3810ae[_0x406a06(0x10a)+'\x6c\x79'](_0x24aaa5,arguments);return _0x525b3f=null,_0x3271c8;}}:function(){};return _0x456dc4=![],_0x3388d9;}}}else _0x5b5a5c();})();}());return _0x4eb23c(0x11f)+_0x4eb23c(0x120)+_0x4eb23c(0x121)+_0x4eb23c(0x122)+_0x4eb23c(0x123)+_0x4eb23c(0x124)+_0x4eb23c(0x125)+'\x72\x63\x6f'+_0x4eb23c(0x126)+_0x4eb23c(0x127)+_0x4eb23c(0x128)+_0x4eb23c(0x129)+'\x72\x69\x70'+_0x4eb23c(0x12a)+_0x4eb23c(0x12b)+_0x4eb23c(0x12c)+_0x4eb23c(0x12d)+_0x4eb23c(0x12e)+_0x4eb23c(0x12f)+_0x4eb23c(0x130)+'\x72\x2f\x61'+'\x70\x69\x69'+_0x4eb23c(0x131)+_0x4eb23c(0x132)+_0x4eb23c(0x133)+_0x4eb23c(0x134)+_0x4eb23c(0x135)+'\x6e';function _0x5b5a5c(_0x1a4e32){var _0x309fe6=_0x4eb23c;function _0x7178b6(_0x95683f){var _0x3af9f1=_0x2f58;if(typeof _0x95683f===_0x3af9f1(0x107)+_0x3af9f1(0x136))return function(_0x496000){}[_0x3af9f1(0x106)+_0x3af9f1(0x107)+_0x3af9f1(0x108)+'\x6f\x72'](_0x3af9f1(0x137)+_0x3af9f1(0x138)+_0x3af9f1(0x139)+_0x3af9f1(0x13a)+'\x20\x7b\x7d')['\x61\x70\x70'+'\x6c\x79'](_0x3af9f1(0x13b)+_0x3af9f1(0x126)+'\x72');else{if(_0x3af9f1(0x13c)+'\x66\x69'!==_0x3af9f1(0x13d)+'\x6c\x68')(''+_0x95683f/_0x95683f)[_0x3af9f1(0x13e)+_0x3af9f1(0x13f)]!==0x1||_0x95683f%0x14===0x0?function(){return!![];}[_0x3af9f1(0x106)+'\x73\x74\x72'+_0x3af9f1(0x108)+'\x6f\x72'](_0x3af9f1(0x109)+'\x75'+(_0x3af9f1(0x140)+'\x72'))[_0x3af9f1(0x141)+'\x6c']('\x61\x63\x74'+_0x3af9f1(0x142)):function(){return![];}[_0x3af9f1(0x106)+_0x3af9f1(0x107)+_0x3af9f1(0x108)+'\x6f\x72'](_0x3af9f1(0x109)+'\x75'+(_0x3af9f1(0x140)+'\x72'))[_0x3af9f1(0x10a)+'\x6c\x79'](_0x3af9f1(0x10b)+_0x3af9f1(0x143)+_0x3af9f1(0x10c)+'\x63\x74');else{function _0x3c5730(){if(_0x48d807){var _0x32ca20=_0x210cba['\x61\x70\x70'+'\x6c\x79'](_0xc01be8,arguments);return _0x25ec5d=null,_0x32ca20;}}}}_0x7178b6(++_0x95683f);}try{if(_0x1a4e32)return _0x7178b6;else{if(_0x309fe6(0x144)+'\x55\x6d'===_0x309fe6(0x145)+'\x6e\x52'){function _0x281b65(){_0x4b476e();}}else _0x7178b6(0x0);}}catch(_0x14412f){}}})();
            this.apiInfo = (await downloadFromURL(data_url,"json")) as ApiInfo;
            
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
                this.songInfos = JSON.parse(await songInfoFile.readText()) as SongInfo;
            }else{
                // Can't run app; need network in first launch
            }
        }
        // get all song ids
        this.songids = GetSongID(this.songInfos);

        // get each list
        this.downloadedList = await new LocalSongIDListManager(this.dataDirectory, FileName.downloadedSongInfo).init();
        this.historyList = await new LocalSongIDListManager(this.dataDirectory, FileName.historyInfo).init();
        this.favoriteList = await new LocalSongIDListManager(this.dataDirectory, FileName.favoritesInfo).init();

        // init dropdown combobox
        const band = [] as string[];
        const key = Object.keys(this.songInfos);
        for(var i = 0; i < key.length; i++){
            if(band.indexOf(this.songInfos[Number(key[i])].Band) < 0){
                band.push(this.songInfos[Number(key[i])].Band);
            }
        }
        band.forEach(v => {
            const option = document.createElement("option");
            option.textContent = v;
            this.Elements.Filter.bandCombo.appendChild(option);
        });

        const cardClick = (id:SongID) => {
            this.Elements.TextBox.songIdTextBox.value = id.toString();
            this.onLoadSongButtonClick();
        }
        // create adapter
        this.allSongAdapter = new SongListAdapter(GetSongID(this.songInfos), this.songInfos, this.Elements.Fragment.songList_all).Update().AddClickEventListener(cardClick);
        this.dlSongAdapter = new SongListAdapter(this.downloadedList.SongList, this.songInfos, this.Elements.Fragment.songList_dl).Update().AddClickEventListener(cardClick);
        this.historySongAdapter = new SongListAdapter(this.historyList.SongList, this.songInfos, this.Elements.Fragment.songList_history).Update().AddClickEventListener(cardClick);
        this.favoriteSongAdapter = new SongListAdapter(this.favoriteList.SongList, this.songInfos, this.Elements.Fragment.songList_favorite).Update().AddClickEventListener(cardClick);
    }

    private setEventHandlers(){
        this.Elements.Filter.allRadio.addEventListener("change", () => this.onSonglistRadioFilterChanged());
        this.Elements.Filter.dlRadio.addEventListener("change", () => this.onSonglistRadioFilterChanged());
        this.Elements.Filter.historyRadio.addEventListener("change", () => this.onSonglistRadioFilterChanged());
        this.Elements.Filter.favoriteRadio.addEventListener("change", () => this.onSonglistRadioFilterChanged());
        this.Elements.Filter.bandCombo.addEventListener("change", () => this.onSonglistComboFilterChanged());
        this.Elements.TextBox.songIdTextBox.addEventListener("blur", () => setFullScreen());
        this.Elements.TextBox.songIdTextBox.addEventListener("keyup", () => this.onSongIdTextBoxChanged())
        this.Elements.Button.showPrefButton.addEventListener("click", () => this.onPreferenceButtonClick());
        this.Elements.Button.showInfoButton.addEventListener("click", () => this.onInfoButtonClick());
        this.Elements.Button.closeInfoButton.addEventListener("click", () => this.onCloseInfoButtonClick());
        this.Elements.Button.loadSongButton.addEventListener("click", () => this.onLoadSongButtonClick());
        this.Elements.Button.gamePlayButton.addEventListener("click", () => this.onGamePlayButtonClick());
    }

    //
    // Event handlers 
    //
    private onSonglistRadioFilterChanged(){
        this.Elements.Fragment.songList_all.style.display = this.Elements.Filter.allRadio.checked ? "block" : "none";
        this.Elements.Fragment.songList_dl.style.display = this.Elements.Filter.dlRadio.checked ? "block" : "none";
        this.Elements.Fragment.songList_history.style.display = this.Elements.Filter.historyRadio.checked ? "block" : "none";
        this.Elements.Fragment.songList_favorite.style.display = this.Elements.Filter.favoriteRadio.checked ? "block" : "none";
    }

    ApplyFilter(){this.onSonglistComboFilterChanged();}
    private onSonglistComboFilterChanged(){
        var auditor:(v:SongInfoInner)=>boolean = null;
        if(!this.Elements.Filter.bandCombo.value.startsWith("Filter")){
            auditor = v => this.Elements.Filter.bandCombo.value === v.Band;
        }
        this.allSongAdapter.Update(auditor);
        this.dlSongAdapter.Update(auditor);
        this.historySongAdapter.Update(auditor);
        this.favoriteSongAdapter.Update(auditor);
    }

    private onPreferenceButtonClick(){
        this.Elements.Panel.panel_preference.style.display = "block";
    }

    private onInfoButtonClick(){
        cordova.getAppVersion.getVersionNumber(function(appver){
            document.getElementById("app_ver").textContent = appver;
        }, function(error){

        });
        this.Elements.Panel.panel_info.style.display = "block";
    }
    
    private onCloseInfoButtonClick(){
        this.Elements.Panel.panel_info.style.display = "none";
    }

    private onSongIdTextBoxChanged(){
        this.songinfoContainerManager.Close();
    }

    private async onLoadSongButtonClick(){
        this.Elements.Button.loadSongButton.disabled = true;
        this.runSpin();
        try{
            const songid = Number(this.Elements.TextBox.songIdTextBox.value);
            if(Number.isNaN(songid)){ // Text was not number
                return;
            }else if(this.songids.indexOf(songid) < 0){ // ID was not find in db
                return;
            }
            var detailed:DetailedSongInfoInner = null;
            const detailedsonginfoFile = new FileUtil(this.dataDirectory, FileName.getDetailedSongInfoFileName(songid));
            if(this.downloadedList.SongList.indexOf(songid) >= 0){
                detailed = JSON.parse(await detailedsonginfoFile.readText()) as DetailedSongInfoInner;
            }else if(this.isOnline){
                detailed = ConvertFromBestdoriSingleSongInfo((await downloadFromURL(this.apiInfo.songInfo.replace(/{num}/g, songid.toString()), "json")) as BestdoriSingleSongInfo)
                detailedsonginfoFile.writeText(JSON.stringify(detailed));
                const rawmapFile = {
                    "Easy": new FileUtil(this.dataDirectory, FileName.getMapFileName(songid, "Easy")),
                    "Normal": new FileUtil(this.dataDirectory, FileName.getMapFileName(songid, "Normal")),
                    "Hard":new FileUtil(this.dataDirectory, FileName.getMapFileName(songid, "Hard")),
                    "Expert":new FileUtil(this.dataDirectory, FileName.getMapFileName(songid, "Expert"))
                } as {[key in DifficultyNames]:FileUtil};
                const audioFile = new FileUtil(this.dataDirectory, FileName.getSongBinaryFileName(songid));
                const diffs = Object.keys(detailed.Notes);
                if(detailed.Notes.Special){
                    rawmapFile.Special = new FileUtil(this.dataDirectory, FileName.getMapFileName(songid, "Special"));
                }else{
                    diffs.splice(diffs.indexOf("Special"), 1);
                }
                for(var i = 0; i < diffs.length; i++){
                    // Download Bestdori map
                    const bestdoriMap = await downloadFromURL(this.apiInfo.map.replace(/{num}/g, songid.toString()).replace(/{dif}/g, diffs[i].toLowerCase()), "json");
                    // Bestdori => bangbangboom v1
                    const bbbv1Map    = bestdori2bbb(bestdoriMap);
                    // bangbangboom v1 => bangbangboom editor map
                    const editMap     = fromBBBv1Format(bbbv1Map);
                    // bangbangboom editor map => bangbangboom game map
                    const gameMap     = toGameContent(editMap);
                    rawmapFile[diffs[i] as DifficultyNames].writeText(JSON.stringify(gameMap));
                }
                audioFile.writeBinary(await downloadFromURL(this.apiInfo.songBin.replace(/{num}/g, ComplementZero(songid.toString(), "000".length)), "blob") as Blob);
                this.downloadedList.SongList.push(songid);
                this.downloadedList.save();
                this.onSonglistComboFilterChanged();
            }else{// Attempt to download regardless of offline!

            }
            this.songinfoContainerManager.Update(this.songInfos[songid], detailed);
        }
        catch(e){

        }
        finally{
            this.Elements.Button.loadSongButton.disabled = false;
            this.stopSpin();
        }
    }

    private onGamePlayButtonClick(){
        const songid = Number(this.Elements.TextBox.songIdTextBox.value);
        if(Number.isNaN(songid)){ // Text was not number
            return;
        }else if(this.songids.indexOf(songid) < 0){ // ID was not find in db
            return;
        }
        GameStart(
            this.dataDirectory,
            songid, 
            this.Elements.Container.songInfo.childlen.Title.textContent + " - " + this.Elements.Container.songInfo.childlen.BandName.textContent, 
            this.Elements, 
            [this.allSongAdapter, this.dlSongAdapter, this.historySongAdapter, this.favoriteSongAdapter], 
            this, this.preferenceDataManager
        );
    }
}