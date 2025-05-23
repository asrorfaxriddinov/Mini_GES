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

const CustomTabBar2 = ({ state, navigation, isDarkMode = false }: CustomTabBarProps) => {
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
    borderTopColor: isDarkMode ? '#444' : '#333',
    backgroundColor: isDarkMode ? '#FEFF9F' : '#1a1a1a',
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

      // /login so'rovini yuborish
      const loginResponse = await fetch(`http://54.93.213.231:9090/login?email=${cachedEmail}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('aaa', cachedEmail)

      if (loginResponse.status === 200) {
        // Agar so'rov muvaffaqiyatli bo'lsa, Boshqaruv2 sahifasiga o'tish
        navigation.navigate('Boshqaruv2');
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

      <TouchableOpacity
        onPress={() => navigation.navigate('HomeTab2')}
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
          {t('Home2')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Edit2')}
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
          {t('Edit2')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleBoshqaruvPress}
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
          {t('Boshqaruv2')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomTabBar2;