// rem: https://stackoverflow.com/questions/49971575/chrome-fetch-api-cannot-load-file-how-to-workaround
if (/^file:\/\/\//.test(location.href)) {
    let path = './';
    let orig = fetch;
    window.fetch = (resource) => {
        return new Promise(function(resolve, reject) {
            let request = new XMLHttpRequest();

            let fail = (error) => {reject(error)};
            ['error', 'abort'].forEach((event) => { request.addEventListener(event, fail); });

            let pull = (expected) => (new Promise((resolve, reject) => {
                if (request.responseType == expected || (expected == 'text' && !request.responseType)){
                    if(resource.endsWith("mp3") || resource.startsWith("blob")){
                        resolve(new Blob([request.response], {type: "audio/mp3"}));
                    }
                    resolve(request.response);
                }else{
                    reject(request.responseType);
                }
            }));

            request.onloadend = () => (resolve({
                arrayBuffer : () => (pull('arraybuffer')),
                blob        : () => (pull('blob')),
                text        : () => (pull('text')),
                json        : () => (pull('json'))
            }));
            request.open('GET', resource);
            if(resource.endsWith("mp3") || resource.startsWith("blob")){
                request.responseType = "blob";
            }else if(resource.endsWith("json")){
                request.responseType = "json";
            }else{
                request.responseType = "text"
            }
            request.send();
        })
    }
}