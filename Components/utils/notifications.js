import { PermissionsAndroid, Platform, Alert } from 'react-native';
import notifee from '@notifee/react-native';

// 🔔 Bildirishnoma ko‘rsatish
export const showNotification = async () => {
  await notifee.displayNotification({
    title: 'Avariya signali!',
    body: 'Charxpalak_up_konsevik 1 ga teng bo‘ldi.',
    android: {
      channelId: 'default',
      sound: 'default',
    },
  });
};

// 📲 Androidda ruxsat so‘rash
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Bildirishnoma uchun ruxsat berilmadi!');
      }
    } catch (err) {
      console.warn('Ruxsat so‘rashda xatolik:', err);
    }
  }
};
