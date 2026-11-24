import React, { useEffect } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';

import {
  initMessaging,
  registerNotificationHandlers,
} from './services/messagingService';

type RootStackParamList = {
  Notes: undefined;
  EditNote?: { note?: any };
};

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initMessaging();

    const unsubscribe = registerNotificationHandlers(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Notes');
      }
    });

    return unsubscribe;
  }, []);

  return <AppNavigator navigationRef={navigationRef} />;
}
