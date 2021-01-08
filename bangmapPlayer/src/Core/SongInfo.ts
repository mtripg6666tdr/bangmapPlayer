export type DifficultyNames = "Easy"|"Normal"|"Hard"|"Expert"|"Special";
export type DifficultyInfos = {[key in DifficultyNames]:number};
export type NoteInfos = {[key in DifficultyNames]:number};
export type HighScoreInfos = {[key in DifficultyNames]:number};
export type FullComboInfos = {[key in DifficultyNames]:boolean};
export type BandID = number;
export type SongID = number;

export type SongInfo ={[key:number]:SongInfoInner};
export type SongInfoInner = {
    Title:string,
    Band:string,
    Difficulties:DifficultyInfos,
};

export type DetailedSongInfo = {
    [key:number]:DetailedSongInfoInner
}

export type DetailedSongInfoInner = {
    Notes:NoteInfos,
    HighScore: HighScoreInfos,
    FullCombo: FullComboInfos,
    CoverImage: string
}

export type BestdoriAllSongInfo = {
    [key:number]:{
        tag:string,
        bandId:BandID,
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

export type BestdoriSingleSongInfo = {
    bgmId:        string;
    bgmFile:      string;
    tag:          any;
    bandId:       number;
    achievements: any;
    jacketImage:  string[];
    seq:          number;
    musicTitle:   string[];
    lyricist:     string[];
    composer:     string[];
    arranger:     string[];
    howToGet:     string[];
    publishedAt:  string[];
    closedAt:     string[];
    description:  string[];
    difficulty:   { 
        [key: string]: {
            playLevel:         number;
            multiLiveScoreMap: any;
            notesQuantity:     number;
            scoreC:            number;
            scoreB:            number;
            scoreA:            number;
            scoreS:            number;
            scoreSS:           number;
        }   
    };
    length:       number;
    notes:        { [key in "0"|"1"|"2"|"3"|"4"]: number };
    bpm:          {
        [key: string]:  {
            bpm:   number;
            start: number;
            end:   number;
        }[]
    };
}