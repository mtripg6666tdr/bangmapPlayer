import { BestdoriAllBandInfo, BestdoriAllSongInfo, DifficultyInfos, SongInfo } from "../Core/SongInfo";

export function ConvertFromBestdori(data:BestdoriAllSongInfo, bands:BestdoriAllBandInfo): SongInfo[] {
    const keys = Object.keys(data);
    var result = [] as SongInfo[];
    for(var s in keys){
        const diffKeys = Object.keys(data[s].difficulty);
        const diffs = {} as DifficultyInfos;
        for(var d in diffKeys){
            switch(d){
                case "0":
                    diffs.Easy = data[s].difficulty[0].playLevel;
                    break;
                case "1":
                    diffs.Normal = data[s].difficulty[1].playLevel;
                    break;
                case "2":
                    diffs.Hard = data[s].difficulty[2].playLevel;
                    break;
                case "3":
                    diffs.Expert = data[s].difficulty[3].playLevel;
                    break;
                case "4":
                    diffs.Special = data[s].difficulty[4].playLevel;
                    break;
            }
        }
        result.push({
            Title:data[s].musicTitle[0],
            Band:bands[data[s].bandId].bandName[0],
            Difficulties:diffs
        });
    }
    return result;
}