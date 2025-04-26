import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Camera Stream</title>
    <style>
        .stream-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
        }
        img {
            width: 380px;
            height: 280px;
            border: 1px solid black;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="stream-container">
        <img id="video1" alt="Live Stream 1">
    </div>

    <script>
        function connectWebSocket(url, elementId) {
            let ws;
            let previousUrl = null;

            function startWebSocket() {
                ws = new WebSocket(url);
                ws.binaryType = 'blob';

                ws.onmessage = function(event) {
                    requestAnimationFrame(() => {
                        const data = event.data;
                        const newUrl = URL.createObjectURL(data);
                        
                        const videoElement = document.getElementById(elementId);
                        videoElement.src = newUrl;

                        if (previousUrl) URL.revokeObjectURL(previousUrl);
                        previousUrl = newUrl;
                    });
                };

                ws.onopen = () => console.log(elementId + " ulanish muvaffaqiyatli.");
                ws.onclose = () => {
                    console.log(elementId + " ulanish uzildi, qayta ulanmoqda...");
                    setTimeout(startWebSocket, 1000);
                };
                ws.onerror = (error) => console.error(elementId + " xatolik:", error);
            }

            startWebSocket();
        }

        connectWebSocket('ws://54.93.213.231:8081/view?id=camera1', 'video1');
    </script>
</body>
</html>
`;

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    androidHardwareAccelerationDisabled={false}
                    startInLoadingState={true}
                    style={styles.webview}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', width: '100%', height: '75%' },
    webview: { height: 400 }, // Reduced height since we only have one camera now
});