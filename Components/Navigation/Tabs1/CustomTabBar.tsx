import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, Keyboard, StatusBar, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  isDarkMode?: boolean;
}
const CustomTabBar = ({ state, navigation, isDarkMode = false }: CustomTabBarProps) => {
  const { t } = useTranslation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const tabBarStyles = {
    flexDirection: 'row' as const,
    height: 56,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#333' : '#eee',
    backgroundColor: isDarkMode ? '#fff0f3' : '#1a1a1a',
    paddingHorizontal: 10,
    justifyContent: 'space-around' as const,
    paddingVertical: 6,
    display: isKeyboardVisible ? 'none' : 'flex' as const,
  };

  const textColor = isDarkMode ? '#666' : '#ccc';
  const activeColor = '#38b000';

  const handleBoshqaruvPress = async () => {
    try {
      // AsyncStorage'dan cached emailni olish
      const cachedEmail = await AsyncStorage.getItem('cachedEmail');
      if (!cachedEmail) {
        Alert.alert('Xatolik', 'Email topilmadi. Iltimos, avval roʻyxatdan oʻting.');
        return;
      }

      // /login so'rovini yuborish (avvalgi kodda eslab qolingan)
      const loginResponse = await fetch(`http://0.0.0.0:9090/login?email=${cachedEmail}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('aaa', cachedEmail)

      if (loginResponse.status === 200) {
        // Agar so'rov muvaffaqiyatli bo'lsa, Boshqaruv sahifasiga o'tish
        navigation.navigate('Boshqaruv');
      } else {
        // Agar xato bo'lsa, xabar ko'rsatish
        Alert.alert('Xatolik', 'Login tasdiqlanmadi. Server javobi: ' + loginResponse.status);
      }
    } catch (error) {
      console.error('Login soʻrovida xatolik:', error);
      Alert.alert('Xatolik', 'Server bilan bogʻlanishda xatolik yuz berdi.');
    }
  };

  return (
    <View style={tabBarStyles}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
        hidden={false}
      />
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeTab')}
        style={{ alignItems: 'center', width: 70 }}
      >
        <Image
          source={require('../../../assets/home.png')}
          style={{
            width: 25,
            height: 25,
            tintColor: state.index === 0 ? activeColor : textColor,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: state.index === 0 ? activeColor : textColor,
          }}
        >
          {t('Home')}
        </Text>
      </TouchableOpacity>

      {/* Edit */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Edit')}
        style={{ alignItems: 'center', width: 70 }}
      >
        <Image
          source={require('../../../assets/edit.png')}
          style={{
            width: 25,
            height: 25,
            tintColor: state.index === 1 ? activeColor : textColor,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: state.index === 1 ? activeColor : textColor,
          }}
        >
          {t('Edit')}
        </Text>
      </TouchableOpacity>

      {/* Boshqaruv */}
      <TouchableOpacity
        onPress={handleBoshqaruvPress} // Yangi funksiya qo‘shildi
        style={{ alignItems: 'center', width: 70 }}
      >
        <Image
          source={require('../../../assets/boshqaruv.png')}
          style={{
            width: 25,
            height: 25,
            tintColor: state.index === 2 ? activeColor : textColor,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: state.index === 2 ? activeColor : textColor,
          }}
        >
          {t('Boshqaruv')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default CustomTabBar;