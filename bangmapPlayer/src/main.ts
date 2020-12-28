export function main(){
    (document.getElementsByClassName("app")[0] as HTMLBodyElement).style.display = "none";
    setFullScreen();
}

function setFullScreen(){
    if(typeof StatusBar !== 'undefined') StatusBar.hide(); 
    if (typeof window.AndroidFullScreen !== 'undefined' && typeof window.AndroidFullScreen.isSupported !== 'undefined') { // Fullscreen plugin exists ? 
        var errorFunction = function(error:any){ console.error(error); } 
        window.AndroidFullScreen.isSupported(window.AndroidFullScreen.immersiveMode, errorFunction); 
    } 
}