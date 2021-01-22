import { Game, GameConfig } from "bangbangboom-game-remixed";
import { Manager } from "./CommonBase";

export class PreferenceDataManager extends Manager {
    private Config: Optional<GameConfig>;

    constructor(){
        super();

        const raw = localStorage.getItem("gameConfig");
        if(raw){
            this.Config = JSON.parse(raw) as Optional<GameConfig>
        }else{
            this.Config = {
                backgroundDim: 0.7,
                barOpacity: 0.8,
                beatNote: false,
                effectVolume: 0.7,
                judgeOffset: 0,
                laneEffect: false,
                mirror: false,
                noteScale: 1.2,
                resolution: 1,
                showSimLine: true,
                speed: 5.0,
                visualOffset: 0
            };
        }
    }

    ExportConfig():Optional<GameConfig> {
        return this.Config;
    }

    SetConfig(pref:Optional<GameConfig>){
        this.Config = pref;
        localStorage.setItem("gameConfig", JSON.stringify(this.Config));
    }
}

type Optional<T> = {
    [prop in keyof T]?: T[prop]
}