package com.yourapp.services;

import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class ForegroundService extends Service {
    private static final String TAG = "ForegroundService";
    private WebSocket webSocket;
    private MediaPlayer mediaPlayer;
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startWebSocket();
        return START_STICKY;
    }
    private void startWebSocket() {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("ws://54.93.213.231:9090/micro_gs_data_blok_ws")
                .build();

        webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onMessage(WebSocket webSocket, String text) {
                Log.d(TAG, "Received: " + text);
                if (text.contains("\"прожектор\":1")) {
                    playSound();
                }
            }
        });
    }

    private void playSound() {
        if (mediaPlayer == null) {
            mediaPlayer = MediaPlayer.create(this, R.raw.alert); // alert.mp3 res/raw ichida
            mediaPlayer.setLooping(false);
        }
        mediaPlayer.start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (webSocket != null) {
            webSocket.cancel();
        }
        if (mediaPlayer != null) {
            mediaPlayer.release();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
