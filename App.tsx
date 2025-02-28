import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store'; // Store yo'li to'g'ri ekanligiga ishonch hosil qiling
import StadiumBookingHome from './screens/StadiumBookingHome'; // "screns" -> "screens"
import Profil from './screens/Profil';
import Brons from './screens/Brons';
import Maxfiylik from './screens/Maxfiylik';
import Settings from './screens/Settings';
import Yordam from './screens/Yordam';
import EditPasswordScreen from './screens/EditPassword';
const Stack = createStackNavigator();

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Brons: undefined;
  Maxfiylik: undefined;
  Settings: undefined;
  Yordam: undefined;
};

const App: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImageChange = (uri: string) => {
    setImageUri(uri);
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => <StadiumBookingHome {...props} imageUri={imageUri} />}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {(props) => (
              <Profil
                {...props}
                imageUri={imageUri ?? ''} // null bo'lsa bo'sh string
                onImageChange={handleImageChange}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Brons" component={Brons} />
          <Stack.Screen name="Maxfiylik" component={Maxfiylik} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Yordam" component={Yordam} />
          <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;