import notifee from '@notifee/react-native';

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