export type SongInfo ={
    Title:string,
    Band:string,
    Difficulties:Difficulty[]
};

export type Difficulty = {
    Name:"Easy"|"Normal"|"Hard"|"Expert"|"Special",
    Level:number
};