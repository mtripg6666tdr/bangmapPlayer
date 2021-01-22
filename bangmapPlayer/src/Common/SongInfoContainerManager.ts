import { bangMapAppElements } from "../Util/bangmapAppElements";
import { DetailedSongInfoInner, DifficultyNames, SongID, SongInfoInner } from "../Core/SongInfo";
import { CommonBase } from "./CommonBase";

export class SongInfoContainerManager extends CommonBase {
    CurrentSongID:SongID = -1;
    private Elements:bangMapAppElements;
    private hasSpecial:boolean;

    constructor(elements:bangMapAppElements){
        super();
        this.Elements = elements;
    }

    Update(maininfo:SongInfoInner, detailedinfo:DetailedSongInfoInner){
        const panelElems = this.Elements.Container.songInfo.childlen;
        panelElems.Title.textContent = maininfo.Title;
        panelElems.BandName.textContent = maininfo.Band;
        panelElems.Levels.Easy.textContent = maininfo.Difficulties.Easy.toString();
        panelElems.Levels.Normal.textContent = maininfo.Difficulties.Normal.toString();
        panelElems.Levels.Hard.textContent = maininfo.Difficulties.Hard.toString();
        panelElems.Levels.Expert.textContent = maininfo.Difficulties.Expert.toString();
        if(maininfo.Difficulties.Special){
            panelElems.Levels.Special.textContent = maininfo.Difficulties.Special.toString();
            panelElems.Levels.Special.style.display = "block";
            this.hasSpecial = true;
        }else{
            panelElems.Levels.Special.style.display = "none";
            this.hasSpecial = false;
        }
        panelElems.Notes.Easy.textContent = detailedinfo.Notes.Easy.toString();
        panelElems.Notes.Normal.textContent = detailedinfo.Notes.Normal.toString();
        panelElems.Notes.Hard.textContent = detailedinfo.Notes.Hard.toString();
        panelElems.Notes.Expert.textContent = detailedinfo.Notes.Expert.toString();
        if(this.hasSpecial){
            panelElems.Notes.Special.textContent = detailedinfo.Notes.Special.toString();
            panelElems.Notes.Special.style.display = "block";
            /* radio input*/panelElems.DifficultySelection.Special
            /*label*/.parentElement./*td*/parentElement.style.display = "block";
            panelElems.SpecialLabel.style.display = "block";
        }else{
            panelElems.Notes.Special.style.display = "none";
            /* radio input*/panelElems.DifficultySelection.Special
            /*label*/.parentElement./*td*/parentElement.style.display = "none";
            panelElems.SpecialLabel.style.display = "none";
            if(panelElems.DifficultySelection.Special.checked){
                panelElems.DifficultySelection.Hard.checked = true;
            }
        }
        this.Elements.Container.songInfo.body.style.display = "block";
    }

    Close(){
        this.Elements.Container.songInfo.body.style.display = "none";
    }

    getSelectedDifficulty():DifficultyNames {
        if(this.hasSpecial && this.Elements.Container.songInfo.childlen.DifficultySelection.Special.checked){
            return "Special";
        }
        const radios = this.Elements.Container.songInfo.childlen.DifficultySelection;
        return radios.Easy.checked ? "Easy" : 
            radios.Normal.checked ? "Normal" : 
            radios.Hard.checked ? "Hard" :
            radios.Expert.checked ? "Expert" : null
    }
}