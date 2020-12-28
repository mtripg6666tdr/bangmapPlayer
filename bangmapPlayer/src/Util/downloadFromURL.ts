type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";

export function downloadFromURL(url:string,type:XMLHttpRequestResponseType){
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.responseType = type;
        xhr.onload = function(){
            resolve(xhr.response);
        };
        xhr.onerror = function(ev){
            reject(ev);
        };
        xhr.send();
    });
}