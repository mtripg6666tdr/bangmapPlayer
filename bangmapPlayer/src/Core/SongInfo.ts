export type DifficultyInfos = {[key in "Easy"|"Normal"|"Hard"|"Expert"|"Special"]:number};

export type SongInfo ={
    Title:string,
    Band:string,
    Difficulties:DifficultyInfos
};

export type BestdoriAllSongInfo = {
    [key:number]:{
        tag:string,
        bandId:number,
        jacketImage:[string],
        musicTitle:[string,string,string,string,string],
        publishedAt:[string,string,string,string,string],
        closedAt:[string,string,string,string,string],
        difficulty:{[key in "0"|"1"|"2"|"3"|"4"]:{playLevel:number}}
    }
}

export type BestdoriAllBandInfo = {
    [key:number]:{
        bandName:[string,string,string,string,string]
    }
}