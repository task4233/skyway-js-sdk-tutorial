'use strict';

import apiKey from '../config';

let localStream = null;
let peer = null;
let existingCall = null;

// カメラ情報, マイク音声の取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // 成功時
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (e) {
        // 失敗時はコンソールにエラーを出力して終了
        console.error('mediaDevice.getUserMedia() error', e);
        return;
    });


// Peerオブジェクト系
peer = new peer({
    key: apiKey(),
    debug: 3
});

// SkyWayのサーバと接続して, 
// 利用する準備が出来たらその情報をUIに表示
peer.on('open', function() {
    $('#my-id').text(peer.id);
});

// エラーが発生したらalert()で通知
peer.on('error', function() {
    alert(err.message);
});

peer.on('disconnected', function() {
    alert('connection closed!');
});

// サーバとの接続が切れたらalert()で通知
peer.on('disconnected', function() {
    alert('connection disconnected!');
});

// 発信ボタンを押した時に発信する
$('#make-call').submit(function(e) {
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

// 切断ボタンを押した時に切断する
$('#end-call').click(function() {
    existingCall.close();
});

// 接続要求が来た時に応答する
peer.on('call', function(call) {
    call.answer(localStream);
    setupCallEventHandlers(call);
});

// 
function setupCallEventHandlers(newCall) {
    // 他の接続がある場合は, 既存の接続を切る
    if (existingCall) {
        existingCall.close();
    }
    existingCall = newCall;

    call.on('stream', function(stream) {
        addVideo(newCall, stream);
        setupEndCallUI();
        $('#their-id').text(newCall.remoteId)
    });

    call.on('close', function() {
        removeVideo(newCall.remoteId);
        setupMakeCallUI();
    });
}
