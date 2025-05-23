import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const ErrorList = () => {
  const [errors, setErrors] = useState([]);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const API_URL = 'http://0.0.0.0:9090/micro_gs_data_blok_read1';
  const POLLING_INTERVAL = 1000; // 1 second

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiData = await response.json();

      const specialElements = [
        'автомат_выкл_akumlator',
        'автомат_выкл_chastotnik_1',
        'автомат_выкл_chastotnik_2',
        'автомат_выкл_panel',
        'автомат_выкл_ввод',
        'автомат_выкл_генератор',
        'автомат_выкл_солнеч_инвер',
        'автомат_выкл_шин_DC_controller',
      ];
      const alarmElements = ['avariya_chastotnik', 'Авария'];

      const errorList = [];
      Object.keys(apiData).forEach((section) => {
        Object.keys(apiData[section]).forEach((key) => {
          const value = apiData[section][key];
          if (specialElements.includes(key) && value === 0) {
            errorList.push(`${key}: O'chirilgan`);
          } else if (alarmElements.includes(key) && value === 1) {
            errorList.push(`${key}: Xatolik`);
          }
        });
      });

      setErrors(errorList);
    } catch (error) {
      console.error("ErrorList ma'lumot olishda xato:", error);
    }
  };

  useEffect(() => {
    // Start polling when component mounts
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);

    // Start blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ])
    ).start();

    // Cleanup: stop polling and animation when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const textColor = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ff0000', '#ff0000'],
  });

  // Modal faqat xatolar bo'lsa ko'rinadi
  if (errors.length === 0) {
    return null; // Hech qanday xato bo'lmasa, hech narsa ko'rsatilmaydi
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {!showAllErrors ? (
          <TouchableOpacity
            style={styles.errorCountContainer}
            onPress={() => setShowAllErrors(true)}
            activeOpacity={0.7}
          >
            <Animated.Text style={[styles.modalText, { color: textColor }]}>
              {errors.length} ta xatolik mavjud
            </Animated.Text>
            <Animated.Text style={[styles.arrow, { color: textColor }]}>
              Ko'proq
            </Animated.Text>
          </TouchableOpacity>
        ) : (
          <>
            {errors.map((error, index) => (
              <Animated.Text
                key={index}
                style={[styles.modalText, { color: textColor }]}
              >
                {error}
              </Animated.Text>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAllErrors(false)}
              activeOpacity={0.7}
            >
              <Animated.Text style={[styles.arrow, { color: textColor }]}>
                ▲
              </Animated.Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: width,
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  errorCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 5,
  },
  arrow: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default ErrorList;