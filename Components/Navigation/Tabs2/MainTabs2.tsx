// src/Components/Navigation/MainTabs2.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Home2 from '../../Charxpalak2/Home2/Home'; // Create new Home2 component
import Edit2 from '../../Charxpalak2/Edit2/Edit'; // Create new Edit2 component
import Boshqaruv2 from '../../Charxpalak2/Boshqaruv2/Boshqaruv'; // Create new Boshqaruv2 component
import CustomTabBar2 from './CustomTabBar2';

const Tab = createBottomTabNavigator();

const MainTabs2 = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar2 {...props} isDarkMode={isDarkMode} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab2" component={Home2} />
      <Tab.Screen name="Edit2" component={Edit2} />
      <Tab.Screen name="Boshqaruv2" component={Boshqaruv2} />
    </Tab.Navigator>
  );
};

export default MainTabs2;