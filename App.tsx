import React, { useState, useEffect } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import store from './redux/store';
import CustomKeyboard from './Components/Password/password';
import MainTabs from './Components/Navigation/Tabs1/MainTabs';
import MainTabs2 from './Components/Navigation/Tabs2/MainTabs2';
import DataTax from './Components/Data/Data';
import { requestNotificationPermission, showNotification } from './Components/utils/notifications';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Bildirishnoma ruxsati va handlerlar
  useEffect(() => {
    requestNotificationPermission();

    // Ilova orqa fonda bo‘lganida push
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📨 Orqa fonda push keldi:', remoteMessage);
    });

    // Ilova ochiq holatda bo‘lsa
    messaging().onMessage(async remoteMessage => {
      console.log('📩 Ilova ochiq holatda push keldi:', remoteMessage);
      showNotification(); // notifee orqali ko‘rsatish
    });
  }, []);

  // Ilova backgroundga o‘tganda API chaqiradi
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        sendApiRequest();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Background API chaqiruv
  const sendApiRequest = () => {
    fetch('http://0.0.0.0:9090/python_bool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'bool_python',
        value: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {() => <CustomKeyboard onLogin={handleLogin} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="DataTax" component={DataTax} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="MainTabs2" component={MainTabs2} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
