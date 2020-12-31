import { SongID } from "../Core/SongInfo";
import { FileUtil } from "../Util/fileUtil";
import { AsyncConstructor, DataManager } from "./CommonBase";

export class LocalSongIDListManager extends DataManager implements AsyncConstructor{
    SongList:SongID[];
    initialized:boolean;

    private directory:DirectoryEntry;
    private fileName:string;

    constructor (directory:DirectoryEntry, filename:string){
        super();
        this.directory = directory;
        this.fileName = filename;
    }

    async init(): Promise<LocalSongIDListManager>{
        this.SongList = await this.getSongIDfromFile();
        this.initialized = true;
        return this;
    }

    save():void {
        const file = new FileUtil(this.directory, this.fileName);
        file.writeText(JSON.stringify(this.SongList))
    }

    get(){
        return this.SongList;
    }

    private async getSongIDfromFile(): Promise<SongID[]>{
        try{
            const file = new FileUtil(this.directory, this.fileName);
            if(await file.exists()){
                return JSON.parse(await file.readText()) as SongID[];
            }else{
                return [] as SongID[];
            }
        }
        catch(e){
            throw e;
        }
    }
}