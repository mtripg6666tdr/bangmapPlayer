import { Adapter } from "./CommonBase"
import { SongID, SongInfo, SongInfoInner } from "../Core/SongInfo"

export class SongListAdapter extends Adapter {
    private data: SongID[];
    private element:HTMLElement;
    private database: SongInfo;

    constructor(data:SongID[], database:SongInfo, element:HTMLElement){
        super();
        this.data = data;
        this.element = element;
        this.database = database;
    }

    Update(auditor?:(data:SongInfoInner)=>boolean):SongListAdapter{
        this._removeAllChildlen();
        if(auditor){
            const v = [] as SongID[];
            this.data.forEach(k => {
                if(auditor(this.database[k])){
                    v.push(k);
                }
            });
            this._update(v);
        }else{
            this._update(this.data);
        }
        return this;
    }

    private _removeAllChildlen(){
        const olds = this.element.children;
        while(olds.length > 0){
            olds[0].remove();
        }
    }

    private _update(data:SongID[]){
        for(var i = 0; i < data.length; i++){
            this.element.appendChild(this.createCard(
                data[i],
                this.database[data[i]].Title,
                this.database[data[i]].Band,
                this.database[data[i]].Difficulties.Easy,
                this.database[data[i]].Difficulties.Normal,
                this.database[data[i]].Difficulties.Hard,
                this.database[data[i]].Difficulties.Expert,
                this.database[data[i]].Difficulties.Special                
            ));
        }
    }

    private createCard(id:SongID,title:string,band:string, level_easy:number, level_normal:number, level_hard:number, level_expert:number, level_special?:number):HTMLElement {
        //
        // p.songCard_title
        //
        const title_p = document.createElement("p");
        title_p.textContent = title;
        title_p.classList.add("songCard_title");

        //
        // p.songCard_band
        //
        const band_p = document.createElement("p");
        band_p.textContent = band;
        band_p.classList.add("songCard_band");

        //
        // p.songCard_levels
        //
        const levels = document.createElement("p");
        levels.classList.add("songCard_levels");

        //
        // p.songCard_levels span.songCard_levels_easy
        //
        const easy = document.createElement("span");
        easy.textContent = level_easy.toString();
        easy.classList.add("songCard_levels_easy");
        levels.appendChild(easy);

        //
        // p.songCard_levels span.songCard_levels_normal
        //
        const normal = document.createElement("span");
        normal.textContent = level_normal.toString();
        normal.classList.add("songCard_levels_normal");
        levels.appendChild(normal);

        //
        // p.songCard_levels span.songCard_levels_hard
        //
        const hard = document.createElement("span");
        hard.textContent = level_hard.toString();
        hard.classList.add("songCard_levels_hard");
        levels.appendChild(hard);

        //
        // p.songCard_levels span.songCard_levels_expert
        //
        const expert = document.createElement("span");
        expert.textContent = level_expert.toString();
        expert.classList.add("songCard_levels_expert");
        levels.appendChild(expert);

        //
        // p.songCard_levels span.songCard_levels_special
        //
        if(level_special){
            const special = document.createElement("span");
            special.textContent = level_special.toString();
            special.classList.add("songCard_levels_special");
            levels.appendChild(special);
        }

        //
        // div.card
        //
        const card = document.createElement("div");
        card.classList.add("songCard","waves-effect","waves-dark","z-depth-1");
        card.dataset["songid"] = id.toString();
        card.appendChild(title_p);
        card.appendChild(band_p);
        card.appendChild(levels);
        return card;
    }
}