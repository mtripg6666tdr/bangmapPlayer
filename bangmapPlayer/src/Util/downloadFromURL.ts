export type donwloadOptions = {
    type?: "text"|"json"|"blob"|"arraybuffer",
    method?: "GET"|"POST",
    payload?: string|object
}

export function downloadFromURL(url:string, option?:donwloadOptions){
    return new Promise<string|Blob|ArrayBuffer>((resolve,reject)=>{
        if(typeof option === "undefined"){
            option = {};
        }
        const xhr = new XMLHttpRequest();
        xhr.open(option.method ?? "GET", url);
        xhr.responseType = option.type ?? "text";
        xhr.onload = function(){
            resolve(xhr.response);
        };
        xhr.onerror = function(ev){
            reject(ev);
        };
        xhr.send(typeof option.payload === "string" ? option.payload : JSON.stringify(option.payload));
    });
}