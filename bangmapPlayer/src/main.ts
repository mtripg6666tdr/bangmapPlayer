import "../node_modules/cordova-plugin-fullscreen/www/AndroidFullScreen";

export function onDeviceReady(){
    (document.getElementsByClassName("app")[0] as HTMLBodyElement).style.display = "none";
    setFullScreen();
    const  loadSongButton = document.getElementById("load_song");
    const  gamePlayButton = document.getElementById("game_play");
    const  showInfoButton = document.getElementById("show_information");
    const closeInfoButton = document.getElementById("close_infoPanel_button");
    const  showPrefButton = document.getElementById("show_preference_panel");
    const  savePrefButton = document.getElementById("preference_save");
    const closePrefButton = document.getElementById("close_preference_button");
}

function setFullScreen(){
    StatusBar.hide(); 
    if (typeof window.AndroidFullScreen !== 'undefined' && typeof window.AndroidFullScreen.isSupported !== 'undefined') { // Fullscreen plugin exists ? 
        var errorFunction = function(error:any){ console.error(error); } 
        window.AndroidFullScreen.isSupported(window.AndroidFullScreen.immersiveMode, errorFunction); 
    } 
}