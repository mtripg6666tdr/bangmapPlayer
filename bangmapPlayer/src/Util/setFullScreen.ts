export function setFullScreen(){
    if(typeof StatusBar !== 'undefined') StatusBar.hide(); 
    if (typeof window.AndroidFullScreen !== 'undefined' && typeof window.AndroidFullScreen.isSupported !== 'undefined') { // Fullscreen plugin exists ? 
        var errorFunction = function(error:any){ console.error(error); } 
        window.AndroidFullScreen.isSupported(window.AndroidFullScreen.immersiveMode, errorFunction); 
    } 
}