import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

const ErrorList = () => {
  const [errors, setErrors] = useState([]);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const WS_URL = "ws://54.93.213.231:9090/micro_gs_data_blok_ws";
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;

  const connectWebSocket = (url: string | URL, retryCount = 0) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(`ErrorList WebSocket ulandi: ${url}`);
    };

    socket.onmessage = (event) => {
      try {
        const apiData = JSON.parse(event.data);
        const specialElements = [
          "автомат_выкл_akumlator",
          "автомат_выкл_chastotnik_1",
          "автомат_выкл_chastotnik_2",
          "автомат_выкл_panel",
          "автомат_выкл_ввод",
          "автомат_выкл_генератор",
          "автомат_выкл_солнеч_инвер",
          "автомат_выкл_шин_DC_controller",
        ];
        const alarmElements = ["avariya_chastotnik", "Авария"];

        const errorList: string[] = [];
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
        console.error("ErrorList WebSocket ma'lumotlarini parse qilishda xato:", error);
      }
    };

    socket.onerror = (error) => {
      console.error(`ErrorList WebSocket xatosi: ${url}`, error);
    };

    socket.onclose = () => {
      console.log(`ErrorList WebSocket uzildi: ${url}`);
      if (retryCount < MAX_RETRIES) {
        console.log(`ErrorList Qayta ulanish urinilmoqda (${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => connectWebSocket(url, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`ErrorList Maksimal urinishlar soniga yetdi: ${url}`);
      }
    };

    return socket;
  };

  useEffect(() => {
    const socket = connectWebSocket(WS_URL);
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

    return () => {
      socket.close();
    };
  }, []);

  const textColor = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ff0000", "#ff0000"],
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
 // Modal faqat o'z joyini egallaydi
  
    width: width,
    alignItems: "center",
    zIndex: 1000, // Modal boshqa elementlar ustida bo'ladi
  },
  modalContent: {
    width: width * 0.9, // Modalning kengligi ekran kengligining 90%
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",

  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  errorCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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