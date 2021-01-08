import { BestdoriAllBandInfo, BestdoriAllSongInfo, BestdoriSingleSongInfo, DetailedSongInfoInner, DifficultyInfos, SongID, SongInfo } from "../Core/SongInfo";

export function ConvertFromBestdori(data:BestdoriAllSongInfo, bands:BestdoriAllBandInfo): SongInfo {
    const keys = Object.keys(data);
    var result = {} as SongInfo;
    for(var i = 0; i < keys.length; i++){
        const diffKeys = Object.keys(data[Number(keys[i])].difficulty);
        const diffs = {} as DifficultyInfos;
        for(var d in diffKeys){
            switch(d){
                case "0":
                    diffs.Easy = data[Number(keys[i])].difficulty[0].playLevel;
                    break;
                case "1":
                    diffs.Normal = data[Number(keys[i])].difficulty[1].playLevel;
                    break;
                case "2":
                    diffs.Hard = data[Number(keys[i])].difficulty[2].playLevel;
                    break;
                case "3":
                    diffs.Expert = data[Number(keys[i])].difficulty[3].playLevel;
                    break;
                case "4":
                    diffs.Special = data[Number(keys[i])].difficulty[4].playLevel;
                    break;
            }
        }
        result[Number(keys[i])] =  {
            Title:data[Number(keys[i])].musicTitle[0],
            Band:bands[data[Number(keys[i])].bandId].bandName[0],
            Difficulties:diffs
        };
    }
    return result;
}

export function GetSongID(infos:SongInfo):SongID[] {
    const num = [] as number[];
    const keys = Object.keys(infos);
    keys.forEach(k => num.push(Number(k)));
    return num;
}

export function ConvertFromBestdoriSingleSongInfo(data:BestdoriSingleSongInfo): DetailedSongInfoInner{
    return {
        FullCombo: {
            Easy:false,
            Normal:false,
            Hard:false,
            Expert:false,
            Special: false,
        },
        HighScore: {
            Easy:0,
            Normal:0,
            Hard:0,
            Expert:0,
            Special:0
        },
        Notes: {
            Easy: data.notes[0],
            Normal: data.notes[1],
            Hard:data.notes[2],
            Expert:data.notes[3],
            Special:data.notes[4]
        },
        CoverImage: data.jacketImage[0]
    }

}