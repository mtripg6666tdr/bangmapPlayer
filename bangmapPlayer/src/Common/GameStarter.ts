import { DetailedSongInfoInner, DifficultyNames, SongID } from "../Core/SongInfo";
import * as FileName from "../Core/FileName";
import { bangMapAppElements } from "../Util/bangmapAppElements";
import { FileUtil } from "../Util/fileUtil";
import { Game } from "bangbangboom-game-remixed";
import { PreferenceDataManager } from "./PreferenceDataManager";

export async function GameStart(directoryEntry:DirectoryEntry, id:SongID, songName:string, elems:bangMapAppElements, configMan:PreferenceDataManager){
    const diff:DifficultyNames = elems.Container.songInfo.childlen.DifficultySelection.Easy.checked ? "Easy" :
                                elems.Container.songInfo.childlen.DifficultySelection.Normal.checked ? "Normal" :
                                elems.Container.songInfo.childlen.DifficultySelection.Hard.checked ? "Hard":"Special";
    // File
    const mapFile = new FileUtil(directoryEntry, FileName.getMapFileName(id, diff));
    const audioFile = new FileUtil(directoryEntry, FileName.getSongBinaryFileName(id));
    // Load each data
    const map = JSON.parse(await mapFile.readText());
    const audio = URL.createObjectURL(new Blob([await audioFile.readBinary()], {type: "audio/mp3"}));
    // Start Game
    console.log(audio);
    const canvas = document.createElement("canvas");
    canvas.style.height = "100%";
    canvas.style.width = "100%";
    elems.MainCanvas.appendChild(canvas);
    elems.MainCanvas.style.display = "block";
    document.getElementsByTagName("nav")[0].style.display = "none";
    const game = new Game(canvas, configMan.ExportConfig(), {
        backgroundSrc: "/android_asset/www/assets/local/bg.jpg",
        loadingMessages: ["Loading...", "Powered by bangbangboom"],
        mapContent: map,
        musicSrc: audio,
        skin: "/android_asset/www/assets/skins",
        songName: songName
    });
    game.ondestroyed = async(r)=>{
        if(r.filter(r => r.fullCombo).length >= 1){
            const detailedsonginfoFile = new FileUtil(this.dataDirectory, FileName.getDetailedSongInfoFileName(id));
            const info = JSON.parse(await detailedsonginfoFile.readText()) as DetailedSongInfoInner;
            info.FullCombo[diff] = true;
            detailedsonginfoFile.writeText(JSON.stringify(info));
        }
        elems.MainCanvas.removeChild(canvas);
        document.getElementsByTagName("nav")[0].style.display = "block";
    };
    game.start();
}