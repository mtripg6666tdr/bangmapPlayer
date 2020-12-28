import { SongID } from "../Core/SongInfo";
import { FileUtil } from "../Util/fileUtil";

export class SongListManager{
    SongList:SongID[];
    initialized:boolean;

    private directory:DirectoryEntry;
    private fileName:string;

    constructor (directory:DirectoryEntry, filename:string){
        this.directory = directory;
        this.fileName = filename;
    }

    async init(): Promise<SongListManager>{
        this.SongList = await this.getSongIDfromFile();
        this.initialized = true;
        return this;
    }

    async getSongIDfromFile(): Promise<SongID[]>{
        try{
            const file = new FileUtil(this.directory, this.fileName);
            if(file.exists()){
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