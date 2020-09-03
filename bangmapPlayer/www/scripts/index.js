// 空白のテンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkID=397704
//cordova-simulate または Android デバイス/エミュレーター上のページ読み込みでコードをデバッグするには、アプリを起動して、ブレークポイントを設定し、
// 次に、JavaScript コンソールで "window.location.reload()" を実行します。
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
        loadSongButton.addEventListener('click', function(e){
            var songTypeElement = document.getElementById('song_type');
            var songIdElement = document.getElementById('song_id');
            var songType = songTypeElement.getAttribute('value');
            var songId = songIdElement.getAttribute('value');
            if (songId == "") {
                window.navigator.notification.alert(
                    "Please type a correct ID",
                    function () { },
                    "Error",
                    "OK"
                );
                return;
            }
            
        });
    };

    function onPause() {
        // TODO: このアプリケーションは中断されました。ここで、アプリケーションの状態を保存します。
    };

    function onResume() {
        // TODO: このアプリケーションが再アクティブ化されました。ここで、アプリケーションの状態を復元します。
    };
} )();