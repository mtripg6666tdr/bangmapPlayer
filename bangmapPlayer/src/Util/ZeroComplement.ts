export function ComplementZero(text:string, digit:number):string{
    if(text.length > digit){
        return text;
    }else{
        while(text.length < digit){
            text = "0" + text;
        }
        return text;
    }
}