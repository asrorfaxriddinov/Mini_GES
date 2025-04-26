import Sound from 'react-native-sound';
import { showNotification } from '../utils/notifications';

const ws = new WebSocket('ws://54.93.213.231:9090/micro_gs_data_blok_ws');

export const startWebSocket = () => {
  ws.onopen = () => {
    console.log('WebSocket ulandi');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.charxpalak_up_konsevik === 1) {
      showNotification();
      playSound();
    }
  };

  ws.onerror = (error) => {
    console.log('Xato:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket uzildi');
  };
};

const playSound = () => {
  const sound = new Sound('signal.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Ovoz faylini yuklashda xato:', error);
      return;
    }
    sound.play(() => sound.release());
  });
};