﻿// 空白のテンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkID=397704
//cordova-simulate または Android デバイス/エミュレーター上のページ読み込みでコードをデバッグするには、アプリを起動して、ブレークポイントを設定し、
// 次に、JavaScript コンソールで "window.location.reload()" を実行します。
/// <reference path="..\..\plugins\cordova-plugin-file\types\index.d.ts" />
/// <reference path="..\..\plugins\cordova-plugin-dialogs\types\index.d.ts" />

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Cordova の一時停止を処理し、イベントを再開します
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova が読み込まれました。ここで、Cordova を必要とする初期化を実行します。
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        listeningElement.setAttribute('style', 'display:none;');
        document.getElementsByClassName('app')[0].setAttribute('style', 'display:none;');

        var loadSongButton = document.getElementById('load_song');
        console.log(loadSongButton);
        loadSongButton.addEventListener("click" ,function(e){
            var songTypeElement = document.getElementById('song_type');
            var songIdElement = document.getElementById('song_id');
            var songType = songTypeElement.value === "official" ? "o" : "c";
            var songId = songIdElement.value;
            var statusTextElement = document.getElementById("status_text");
            var mainProgressElement = document.getElementById("main_progress");
            var mainProgressHolderElement = document.getElementById("main_progress_holder");

            var infoFileName = songType + songId + "i.json";
            var songFileName = songType + songId + "b.mp3";
            var getMapFileName = function(diffNum){
                if(diffNum === "0" || diffNum === "1" || diffNum === "2" || diffNum === "3"){
                    return songType + songId + "m" + diffNum + ".json"
                }else{
                    throw new Error("System.ArgumentNullException; type of argument diffNum must be string expressing number");
                }
            };

            var settingSongInfoElement = document.getElementById("setting_songInfo_table");
            var songNameElement = document.getElementById("song_name");
            var songBandElement = document.getElementById("song_band");
            var songLevelEasyElement = document.getElementById("song_level_easy");
            var songLevelNormalElement = document.getElementById("song_level_normal");
            var songLevelHardElement = document.getElementById("song_level_hard");
            var songLevelExpertElement = document.getElementById("song_level_expert");
            var songNotesEasyElement = document.getElementById("song_notes_easy");
            var songNotesNormalElement = document.getElementById("song_notes_normal");
            var songNotesHardElement = document.getElementById("song_notes_hard");
            var songNotesExpertElement = document.getElementById("song_notes_expert");

            if (songId == "") {
                window.navigator.notification.alert(
                    "Please type a correct ID",
                    function () { },
                    "Error",
                    "OK"
                );
                return;
            }

            var progressMessages = {
                DownloadSongInfo: {
                    text: "Downloading specified song information...",
                    id: 0
                },
                DonwloadBandInfo: {
                    text:"Downloading band information...",
                    id: 1
                },
                DownloadSongAudio: {
                    text:"Downloading specified song audio...",
                    id: 2
                },
                StartMapDownload: {
                    text:"Starting downloading map...",
                    id: 3
                },
                EasyMapDownloadFinish: {
                    text:"Finish downloading easy map",
                    id: 4
                },
                NormalMapDownloadFinish: {
                    text: "Finish downloading normal map",
                    id: 5
                },
                HardMapDownloadFinish: {
                    text: "Finish downloading hard map",
                    id: 6
                },
                ExpertMapDownloadFinish: {
                    text:"Ready",
                    id:7
                }
            };
            var progressChange = function(status_message){
                mainProgressHolderElement.style.opacity = "1";
                statusTextElement.textContent = status_message.text;
                mainProgressElement.style.width = Math.floor((status_message.id + 1) / 8 * 100).toString() + "%";
            };

            if (songType === "o") {
                var loadInfo = function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var info = JSON.parse(this.result);
                            songNameElement.textContent = info.name;
                            songBandElement.textContent = info.band;
                            var difficulties = info.difficulty;
                            songLevelEasyElement.textContent = difficulties[0].level;
                            songLevelNormalElement.textContent = difficulties[1].level;
                            songLevelHardElement.textContent = difficulties[2].level;
                            songLevelExpertElement.textContent = difficulties[3].level;
                            songNotesEasyElement.textContent = difficulties[0].notes;
                            songNotesNormalElement.textContent = difficulties[1].notes;
                            songNotesHardElement.textContent = difficulties[2].notes;
                            songNotesExpertElement.textContent = difficulties[3].notes;
                            settingSongInfoElement.style.display = "block";
                            settingSongInfoElement.dataset.sID = songId;
                            statusTextElement.textContent = "Ready";
                        };
                        statusTextElement.textContent = "Loading specified song information from local cache...";
                        reader.readAsText(file);
                    }, function (error) {

                    });
                };
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (entry) {
                    entry.getFile(infoFileName, { create: false }, function (fileEntry) {
                        loadInfo(fileEntry);
                    }, function (error) {
                        var dataURL = "https://bestdori.com/api/songs/" + songId + ".json";
                        var bandURL = "https://bestdori.com/api/bands/all.1.json";
                        var bgmURL = "https://bestdori.com/assets/jp/sound/bgm" + songId + "_rip/bgm" + songId + ".mp3";
                        var mapURL = [
                            "https://bestdori.com/api/songs/chart/" + songId + ".easy.json",
                            "https://bestdori.com/api/songs/chart/" + songId + ".normal.json",
                            "https://bestdori.com/api/songs/chart/" + songId + ".hard.json",
                            "https://bestdori.com/api/songs/chart/" + songId + ".expert.json"
                        ];
                        var data, band;
                        var xhrData = new XMLHttpRequest();
                        xhrData.open('GET', dataURL, true);
                        xhrData.responseType = "json";
                        xhrData.onload = function () {
                            if (this.status == 200) {
                                data = this.response;
                                var xhrBand = new XMLHttpRequest();
                                xhrBand.open('GET', bandURL, true);
                                xhrBand.responseType = "json";
                                xhrBand.onload = function () {
                                    band = this.response;
                                    var alldiffs = data.difficulty;
                                    var keys = Object.keys(alldiffs);
                                    var length = keys.length;
                                    var filDiffs = [];
                                    for (var i = 0; i < length; i++) {
                                        var cKey = keys[i];
                                        filDiffs.push({
                                            level: alldiffs[cKey]["playLevel"],
                                            notes: data.notes[cKey]
                                        });
                                    }
                                    var info = {
                                        name: data.musicTitle[0],
                                        band: band[data.bandId].bandName[0],
                                        difficulty: filDiffs
                                    };
                                    entry.getFile(infoFileName, { create: true }, function (wFileEntry) {
                                        wFileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function () {
                                                var BGMxhr = new XMLHttpRequest();
                                                BGMxhr.open('GET', bgmURL);
                                                BGMxhr.responseType = "blob";
                                                BGMxhr.onload = function(){
                                                    if(this.status === 200){
                                                        var BGMblob = new Blob([this.response], {type: "audio/mpeg"});
                                                        entry.getFile(songFileName, {create: true}, function(aFileEntry){
                                                            aFileEntry.createWriter(function(aFileWriter){
                                                                aFileWriter.onwriteend = function(){
                                                                    var mapURLLength = mapURL.length;
                                                                    progressChange(progressMessages.StartMapDownload);
                                                                    for(var i = 0; i < mapURLLength; i++) {
                                                                        var mapXhr = new XMLHttpRequest();
                                                                        mapXhr.open('GET', mapURL[i]);
                                                                        mapXhr.responseType = "json";
                                                                        mapXhr.xID = i;
                                                                        mapXhr.onload = function(){
                                                                            var mpStr = JSON.stringify(this.response)
                                                                            var cID = this.xID;
                                                                            entry.getFile(getMapFileName(this.xID.toString()), {create: true}, function(mFileEntry){
                                                                                mFileEntry.createWriter(function(mFileWriter){
                                                                                    mFileWriter.onwriteend = function(){
                                                                                        console.log("Download file id " + cID + "is completed.");
                                                                                        switch(cID){
                                                                                            case 0:
                                                                                                progressChange(progressMessages.EasyMapDownloadFinish);
                                                                                                break;
                                                                                            case 1:
                                                                                                progressChange(progressMessages.NormalMapDownloadFinish);
                                                                                                break;
                                                                                            case 2:
                                                                                                progressChange(progressMessages.HardMapDownloadFinish);
                                                                                                break;
                                                                                            case 3:
                                                                                                progressChange(progressMessages.ExpertMapDownloadFinish);
                                                                                                break;
                                                                                        }
                                                                                    };
                                                                                    mFileWriter.onerror = function(){
                                                                                        console.log("Download file id " + cID + " is failed.");
                                                                                    };
                                                                                    mFileWriter.write(new Blob([mpStr], {type: "text/plain"}));
                                                                                });
                                                                            }, function(){

                                                                            });
                                                                        };
                                                                        mapXhr.send();
                                                                    }
                                                                    loadInfo(wFileEntry);
                                                                };
                                                                aFileWriter.onerror = function(){

                                                                };
                                                                aFileWriter.write(BGMblob);
                                                            });
                                                        }, function(){

                                                        });
                                                    }
                                                };
                                                progressChange(progressMessages.DownloadSongAudio);
                                                BGMxhr.send();
                                            };
                                            fileWriter.onerror = function (e) {

                                            };
                                            fileWriter.write(new Blob([JSON.stringify(info)], { type: 'text/plain' }));
                                        });
                                    }, function () {

                                    });
                                };
                                progressChange(progressMessages.DonwloadBandInfo)
                                xhrBand.send();
                            } else {
                                window.navigator.notification.alert(
                                    "Cannot download song data.",
                                    function () {
                                        //何か終了する処理。未実装。
                                    },
                                    "Error",
                                    "Quit"
                                );
                            }
                        };
                        progressChange(progressMessages.DownloadSongInfo);
                        xhrData.send();
                    })
                }, function (error) {
                    window.navigator.notification.alert(
                        "Cannot resolve data directory path.",
                        function () {
                            //何か終了する処理。未実装。
                        },
                        "Error",
                        "Quit"
                    )
                });
            }
        });

        var gamePlayButton = document.getElementById("game_play");
        console.log(gamePlayButton);
        gamePlayButton.addEventListener("click", function(e){
            var songTypeElement = document.getElementById('song_type');
            var songType = songTypeElement.value === "official" ? "o" : "c";

            var settingSongInfoElement = document.getElementById("setting_songInfo_table");
            var songNameElement = document.getElementById("song_name");
            var songBandElement = document.getElementById("song_band");
            
            var selectedDiff = 
                document.getElementById("song_diff_select_easy").checked ? "0" :
                document.getElementById("song_diff_select_normal").checked ? "1" : 
                document.getElementById("song_diff_select_hard").checked ? "2" :
                document.getElementById("song_diff_select_expert").checked ? "3" : "-1";
            var songId = settingSongInfoElement.dataset.sID;
            var songFileName = songType + songId + "b.mp3";
            var getMapFileName = function(diffNum){
                if(diffNum === "0" || diffNum === "1" || diffNum === "2" || diffNum === "3"){
                    return songType + songId + "m" + diffNum + ".json"
                }else{
                    throw new Error("System.ArgumentNullException; type of argument diffNum must be string expressing number");
                }
            };

            if (songId == "") {
                window.navigator.notification.alert(
                    "Please type a correct ID",
                    function () { },
                    "Error",
                    "OK"
                );
                return;
            }

            var mainMap, songURL;

            if(songType === "o"){
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (entry) {
                    entry.getFile(getMapFileName(selectedDiff), {create:false}, function(fileEntry){
                        fileEntry.file(function(file){
                            var reader = new FileReader();
                            reader.onloadend = function(){
                                mainMap = bestdori2bbb(JSON.parse(this.result));
                                entry.getFile(songFileName, {create:false}, function(sFileEntry){
                                    sFileEntry.file(function(sFile){
                                        var sReader = new FileReader();
                                        sReader.onloadend = function(){
                                            songURL = this.result;

                                            let GameConfig = {
                                                backgroundDim: 0.7,
                                                barOpacity: 0.8,
                                                beatNote: false,
                                                effectVolume: 0.7,
                                                judgeOffset: 0,
                                                laneEffect: false,
                                                mirror: false,
                                                noteScale: 1.2,
                                                resolution: 1,
                                                //GameConfig.resolution = GameConfig.resolution ? 2 : 1;
                                                showSimLine: true,
                                                speed: 5.0,
                                                visualOffset: 0
                                            };
                                            let GameLoadConfig = {
                                                mapSrc: URL.createObjectURL(new Blob([mainMap])), // some function that loads the map content
                                                musicSrc: songURL,
                                                backgroundSrc: "/android_asset/www/assets/local/bg.jpg",
                                                skin: "/android_asset/www/assets/skins",
                                                songName: songNameElement.textContent  + " - " + songBandElement.textContent,
                                                loadingMessages: ["Loading", "Powered by bangbangboom"]
                                            };
    // musicSrc = ""
    // mapSrc = ""
    // backgroundSrc = ""
    // skin = ""
    // songName = ""
    // loadingMessages?: string[]
                                            function GameStart() {
                                                const div = document.getElementById("app_game");
                                                document.getElementById("setting_panel").style.display = "none";
                                                document.getElementsByTagName("nav")[0].style.display = "none";
                                                const canvas = document.createElement("canvas");
                                                canvas.style.height = "100%";
                                                canvas.style.width = "100%";
                                                div.appendChild(canvas);
                                                div.style.display = "block";
                                            
                                                const game = new BangGame.Game(canvas, GameConfig, GameLoadConfig);
                                                game.start();
                                                game.ondestroyed = () => {
                                                    div.removeChild(canvas);
                                                    document.getElementById("setting_panel").style.display = "block";
                                                    document.getElementsByTagName("nav")[0].style.display = "block";
                                                };
                                            };
                                            GameStart();
                                        };
                                        sReader.readAsDataURL(sFile);
                                    })
                                }, function(e){

                                });
                            };
                            reader.readAsText(file);
                        }, function(e){

                        })
                    }, function(e){

                    });
                }, function(error){

                });
            }
        });

        document.getElementById("song_id").addEventListener("blur", function(){
            StatusBar.hide(); 
            if (typeof AndroidFullScreen !== 'undefined') { // Fullscreen plugin exists ? 
                function errorFunction(error) { console.error(error); } 
                AndroidFullScreen.isSupported(AndroidFullScreen.immersiveMode, errorFunction); 
            } 
        });

        document.getElementById("show_information").addEventListener("click", function(){
            window.navigator.notification.alert(
                "bangmapPlayer (" + window.navigator.appVersion + ") by mtripg6666tdr (mtripg6666tdr@outlook.com)\r\n" +
                "GitHub: https://github.com/mtripg6666tdr/bangmapPlayer\r\n" +
                "LICENSE NOTICE\r\n" + 
                "This application contains a package or plugin distributed under MIT License\r\n" +
                "bangbangboom-game: https://github.com/K024/bangbangboom-game  (MIT License) \r\n" + 
                "BanGround Player:  https://github.com/zz5840/BanGround-Player (No License)\r\n" + 
                "Materialize:       https://materializecss.com/                (MIT License)"
                ,
                ()=>{},
                "App Info",
                "OK"
            )
        });

        document.getElementById("show_song_list").addEventListener("click", function(){
            
        });
    };

    function onPause() {
        // TODO: このアプリケーションは中断されました。ここで、アプリケーションの状態を保存します。
    };

    function onResume() {
        // TODO: このアプリケーションが再アクティブ化されました。ここで、アプリケーションの状態を復元します。
    };
} )();