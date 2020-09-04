// 空白のテンプレートの概要については、次のドキュメントを参照してください:
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
        loadSongButton.onclick = function(e){
            var songTypeElement = document.getElementById('song_type');
            var songIdElement = document.getElementById('song_id');
            var songType = songTypeElement.value === "official" ? "o" : "c";
            var songId = songIdElement.value;
            var statusTextElement = document.getElementById("status_text");

            var infoFileName = songType + songId + "i.json";
            var songFileName = songType + songId + "b.mp3";
            var mapFileName = songType + songId + "m.json";

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
                            statusTextElement.textContent = "Ready.";
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
                                                loadInfo(wFileEntry);
                                            };
                                            fileWriter.onerror = function (e) {

                                            };
                                            fileWriter.write(new Blob([JSON.stringify(info)], { type: 'text/plain' }));
                                        });
                                    }, function () {

                                    });
                                };
                                statusTextElement.textContent = "Downloading band information...";
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
                        statusTextElement.textContent = "Downloading specified song information...";
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
        };
    };

    function onPause() {
        // TODO: このアプリケーションは中断されました。ここで、アプリケーションの状態を保存します。
    };

    function onResume() {
        // TODO: このアプリケーションが再アクティブ化されました。ここで、アプリケーションの状態を復元します。
    };
} )();