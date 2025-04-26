import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Home from '../../Charxpalak1/Home/Home';
import Edit from '../../Charxpalak1/Edit/Edit';
import Malumotlar from '../../Charxpalak1/Malumotlar/Malumotlar';
import CustomTabBar from './CustomTabBar';
import Boshqaruv from '../../Charxpalak1/Boshqaruv/Boshqaruv';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EditStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EditHome" component={Edit} />
    <Stack.Screen name="Boshqaruv" component={Boshqaruv} />
    <Stack.Screen name="Malumotlar" component={Malumotlar} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} isDarkMode={isDarkMode} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="Edit" component={EditStack} />
      <Tab.Screen name="Boshqaruv" component={Boshqaruv} />
    </Tab.Navigator>
  );
};

export default MainTabs;