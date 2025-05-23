import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';

// Tovushni sozlash
Sound.setCategory('Playback');

// Push kelganda bu funksiya chaqiriladi
export async function backgroundMessageHandler(remoteMessage) {
  console.log('🔔 Push keldi [Background]:', remoteMessage);

  const title = remoteMessage.notification?.title?.toLowerCase() || '';
  if (title.includes('avariya')) {
    const alarm = new Sound('signal.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Tovush yuklanmadi:', error);
        return;
      }

      alarm.setVolume(1.0);
      alarm.play((success) => {
        if (!success) {
          console.log('Tovush chalishda xatolik');
        }
      });
    });
  }
}
