import { ApiInfo } from "../Core/ApiInfo";
import { DifficultyNames, SongID } from "../Core/SongInfo";
import { downloadFromURL } from "../Util/downloadFromURL";
import { FileUtil } from "../Util/fileUtil";
import { Manager } from "./CommonBase";

export class SongDataManager extends Manager {
    private directory:DirectoryEntry;
    private downloaded:SongID[];
    private apiInfo:ApiInfo;

    constructor(directory:DirectoryEntry, downloaded:SongID[], apiInfo:ApiInfo){
        super();
        this.directory = directory;
        this.downloaded = downloaded;
        this.apiInfo = apiInfo;
    }

    private getIfDownloaded(id:SongID):boolean {
        return this.downloaded.indexOf(id) >= 0;
    }

    private async getAudioSrc(id:SongID):Promise<string> {
        if(this.getIfDownloaded(id)){
            const file = new FileUtil(this.directory, id + "b.mp3");
            return await file.readBinary()
        }else{
            const b = new Blob([await downloadFromURL(this.apiInfo.songBin.replace(/{num}/g, id.toString()), "blob") as Blob], {type:"audio/mp3"});
            const file = new FileUtil(this.directory, id + "b.mp3");
            await file.writeBinary(b);
            return URL.createObjectURL(b);
        }
    }

    private async getMap(id:SongID, difficulty:DifficultyNames){
        
    }
}