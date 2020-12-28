import { SongID } from "../Core/SongInfo";
import { FileUtil } from "../Util/fileUtil";
import { AsyncConstructor, Manager } from "./CommonBase";

export class SongListManager extends Manager implements AsyncConstructor{
    SongList:SongID[];
    initialized:boolean;

    private directory:DirectoryEntry;
    private fileName:string;

    constructor (directory:DirectoryEntry, filename:string){
        super();
        this.directory = directory;
        this.fileName = filename;
    }

    async init(): Promise<SongListManager>{
        this.SongList = await this.getSongIDfromFile();
        this.initialized = true;
        return this;
    }

    private async getSongIDfromFile(): Promise<SongID[]>{
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