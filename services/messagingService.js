import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

import {
  getMessaging,
  requestPermission,
  subscribeToTopic,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

const { NotificationModule } = NativeModules;

const messaging = getMessaging();

export const initMessaging = async () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return false;
      }
    }

    await subscribeToTopic(messaging, 'notes');

    console.log('Subscribed to topic: notes');
    return true;
  } catch (error) {
    console.log('Init messaging error:', error);
    return false;
  }
};

export const registerNotificationHandlers = onTap => {
  const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
    const title = remoteMessage.notification?.title || 'New Note Added';

    const body = remoteMessage.notification?.body || 'A new note was created';

    console.log('Foreground notification:', remoteMessage);

    if (NotificationModule) {
      NotificationModule.displayNotification(title, body);
    }
  });

  const unsubscribeOpened = onNotificationOpenedApp(
    messaging,
    remoteMessage => {
      console.log('Notification opened:', remoteMessage);
      onTap?.(remoteMessage);
    },
  );

  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      console.log('App opened from quit state:', remoteMessage);
      onTap?.(remoteMessage);
    }
  });

  return () => {
    unsubscribeForeground();
    unsubscribeOpened();
  };
};
