import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import CustomKeyboard from './Components/Password/password';
import MainTabs from './Components/Navigation/Tabs1/MainTabs';
import MainTabs2 from './Components/Navigation/Tabs2/MainTabs2';
import DataTax from './Components/Data/Data';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const sendApiRequest = () => {
    fetch('http://54.93.213.231:9090/python_bool', {
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

  useEffect(() => {
    // AppState o‘zgarishini kuzatish
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        sendApiRequest();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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