import React, { useState, useEffect, useRef } from "react";
import {View,Text,StyleSheet,TouchableOpacity,Image,Animated,Modal,TextInput,TouchableWithoutFeedback,StatusBar,Dimensions,} from "react-native";
import Camera from "../../camera/camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tarix11 from "../Tarix/tarix"
import ErrorList from "../Errors/Error";
const { width, height } = Dimensions.get("window");

const Boshqaruv = () => {
  const [isPressed1, setIsPressed1] = useState(false); 
  const [isPressed2, setIsPressed2] = useState(false); 
  const [isSwitchOn, setIsSwitchOn] = useState(false); 
  const [isPressed4, setIsPressed4] = useState(false); 
  const [isPressed3, setIsPressed3] = useState(false); 
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const[tarix,setTarix] = useState(true)
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;

  const rotate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 28],
  });

  const connectWebSocket = (
    url: string | URL,
    onMessage: ((this: WebSocket, ev: MessageEvent) => any) | null,
    retryCount = 0
  ) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnecting(false);
      console.log(`WebSocket ulandi: ${url}`);
    };

    socket.onmessage = onMessage;

    socket.onerror = (error) => {
      console.error(`WebSocket xatosi: ${url}`, error);
      setIsConnecting(true);
    };

    socket.onclose = () => {
      console.log(`WebSocket uzildi: ${url}`);
      if (retryCount < MAX_RETRIES) {
        console.log(`Qayta ulanish urinilmoqda (${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => connectWebSocket(url, onMessage, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Maksimal urinishlar soniga yetdi: ${url}`);
        setIsConnecting(false);
      }
    };

    return socket;
  };

  useEffect(() => {
    const WS_URL1 = "ws://0.0.0.0:9090/micro_gs_data_blok_ws1";
    const WS_URL2 = "ws://0.0.0.0:9090/datas_ws";

    const socket1 = connectWebSocket(WS_URL1, (event) => {
      try {
        const json = JSON.parse(event.data);
        const prozhektorValue = json.datas?.прожектор;
        if (prozhektorValue !== undefined) {
          setIsSwitchOn(prozhektorValue === 1);
          console.log("Serverdan прожектор qiymati:", prozhektorValue);
        }
      } catch (error) {
        console.error("WS1 ma'lumotlarini parse qilishda xato:", error);
      }
    });

    const socket2 = connectWebSocket(WS_URL2, (event) => {
      try {
        const data = JSON.parse(event.data);
        setIsPressed1(data.Tepaga2 === 1);
        setIsPressed2(data.Pastga2 === 1);
        setIsPressed3(data.TEL_Shkaf2 === 1);
        setIsPressed4(data.restart_pc2 === 1);
        console.log("Serverdan yangi holat:", data);
      } catch (error) {
        console.error("WS2 ma'lumotlarini parse qilishda xato:", error);
      }
    });

    return () => {
      socket1.close();
      socket2.close();
    };
  }, []);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSwitchOn ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isSwitchOn]);

  useEffect(() => {
    setHasError(inputValue > 5000);
  }, [inputValue]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isPressed4) {
      animation = Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      rotationValue.stopAnimation();
      Animated.timing(rotationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    return () => animation?.stop();
  }, [isPressed4]);

  useEffect(() => {
    const WS_URL3 = "ws://0.0.0.0:9090/getall_ws";
  
    const socket3 = connectWebSocket(WS_URL3, (event) => {
      try {
        // Skip empty or invalid messages
        if (!event.data) {
          console.warn("WebSocketdan bo'sh ma'lumot keldi");
          setActiveUser(null);
          return;
        }
  
        const result = JSON.parse(event.data);
        // Check if result is an array
        if (Array.isArray(result)) {
          const activeUsers = result.filter((user) => user.Active === true);
          console.log("WebSocketdan active users:", activeUsers);
          if (activeUsers.length > 0 && activeUsers[0].Email && activeUsers[0].Image) {
            setActiveUser({ email: activeUsers[0].Email, image: activeUsers[0].Image });
          } else {
            setActiveUser(null);
          }
        } else {
          console.warn("WebSocketdan kutilmagan ma'lumot formati:", result);
          setActiveUser(null);
        }
      } catch (error) {
        console.error("WS3 ma'lumotlarini parse qilishda xato:", error);
        setActiveUser(null);
      }
    });
  
    return () => {
      socket3.close();
    };
  }, []);

  const sendPostRequest = async (key: string, value: number, autoReset = false) => {
    try {
      const response = await fetch("http://0.0.0.0:9090/datas_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (autoReset && value === 1) {
        setTimeout(async () => {
          await fetch("http://0.0.0.0:9090/datas_post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: 0 }),
          });
        }, 2000);
      }

      if (!response.ok) console.error("POST so'rovida xato:", response.status);
    } catch (error) {
      console.error("POST so'rovini yuborishda xato:", error);
    }
  };

  const sendMonitorPostRequest = async (boshqaruv: string, value: number) => {
    try {
      const cachedEmail = await AsyncStorage.getItem("cachedEmail");
      if (!cachedEmail) {
        console.error("Keshda email topilmadi");
        return;
      }
      const payload = {
        Email: cachedEmail,
        Boshqaruv: boshqaruv,
        Value: value,
      };

      console.log("Sending monitor POST request with payload:", payload);

      const response = await fetch("http://0.0.0.0:9090/post_monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Monitor POST so'rovida xato: ${response.status}`,
          `Error message: ${errorText}`
        );
        return;
      }

      console.log("Monitor POST so'rovi muvaffaqiyatli yuborildi");
    } catch (error) {
      console.error("Monitor POST so'rovini yuborishda xato:", error);
    }
  };

  const sendPutRequest = async (active: boolean) => {
    try {
      const id = await AsyncStorage.getItem("cachedId");
      if (!id) {
        console.error("Keshda ID topilmadi");
        return;
      }
    
      const response = await fetch("http://0.0.0.0:9090/active", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          active: active,
        }),
      });
      console.log('aaa',)
      if (!response.ok) console.error("PUT so'rovida xato:", response.status);
    } catch (error) {
      console.error("PUT so'rovini yuborishda xato:", error);
    }
  };

  const checkActiveUsersAndEmail = async () => {
    try {
      const response = await fetch("http://0.0.0.0:9090/getall", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      const cachedEmail = await AsyncStorage.getItem("cachedEmail");

      const activeUsers = result.data.filter((user: { Active: boolean; }) => user.Active === true);

      if (activeUsers.length === 0) {
        return { canControl: true, image: null, email: null };
      }

      const activeUser = activeUsers[0];
      if (cachedEmail && activeUser.Email === cachedEmail) {
        return { canControl: true, image: activeUser.Image, email: activeUser.Email };
      }

      return { canControl: false, image: activeUser.Image, email: activeUser.Email };
    } catch (error) {
      console.error("Active foydalanuvchilarni tekshirishda xato:", error);
      return { canControl: false, image: null, email: null };
    }
  };

  const handleFrequencySubmit = async (chastotnikNumber: number) => {
    const value = parseInt(inputValue);
    if (value > 5000 || isNaN(value)) return;

    await sendPostRequest(`${chastotnikNumber}_Chastotnik_frequency`, value);
    setInputValue("");
    setModalVisible1(false);
    setModalVisible2(false);
  };

  const closeModal = () => {
    setModalVisible1(false);
    setModalVisible2(false);
    setInputValue("");
  };

  const handleUpPressIn = async () => {
    const { canControl } = await checkActiveUsersAndEmail();
    if (!canControl) {
      console.log("Boshqaruvga ruxsat yo'q");
      return;
    }
    await Promise.all([
      sendPostRequest("Tepaga2", 1),
      sendMonitorPostRequest("Tepaga2", 1),
      sendPutRequest(true),
    ]);
  };

  const handleUpPressOut = async () => {
    const { canControl } = await checkActiveUsersAndEmail();
    if (!canControl) {
      console.log("Boshqaruvga ruxsat yo'q");
      return;
    }
    await Promise.all([
      sendPostRequest("Tepaga2", 0),
      sendMonitorPostRequest("Tepaga2", 0),
      sendPutRequest(false),
    ]);
  };
  const handleDownPressIn = async () => {
    const { canControl } = await checkActiveUsersAndEmail();
    if (!canControl) return;
    sendPostRequest("Pastga2", 1);
    sendPutRequest(true);
    await Promise.all([
      sendPostRequest("pastga2", 1),
      sendMonitorPostRequest("pastga2", 1),
      sendPutRequest(true),
    ]);
  };
  const handleDownPressOut = async () => {
    const { canControl } = await checkActiveUsersAndEmail();
    if (!canControl) return;
    sendPostRequest("Pastga2", 0);
    sendPutRequest(false);
    await Promise.all([
      sendPostRequest("pastga2", 0),
      sendMonitorPostRequest("pastga2", 0),
      sendPutRequest(false),
    ]);
  };
  const toggleSwitch = () => {
    const newState = !isSwitchOn;
    setIsSwitchOn(newState);
    sendPostRequest("projektor_on_off2", newState ? 1 : 0);
  };

  const handleRestartPress = () => {
    const newState = !isPressed4;
    sendPostRequest("restart_pc2", newState ? 1 : 0, true);
  };

  const handleRejimPress = async () => {
    const { canControl } = await checkActiveUsersAndEmail();
    if (!canControl) return;
    sendPostRequest("TEL_Shkaf2", !isPressed3 ? 1 : 0);
  };

  const Chastotnik1 = () => setModalVisible1(true);
  const Chastotnik2 = () => setModalVisible2(true);

  const showCamera = async () => {
    await fetch("http://0.0.0.0:9090/booling_post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "bool_kamera", value: true }),
    });
    setIsCameraVisible(true);
  };
  const Tarix = () => {
    setTarix(false)
  } 
  const Tarix1 = () => {
    setTarix(true)
  } 
  const hideCamera = async () => {
    await fetch("http://0.0.0.0:9090/booling_post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "bool_kamera", value: false }),
    });
    setIsCameraVisible(false);
  };

  const handleBackspace = () => setInputValue(inputValue.slice(0, -1));
  const handleKeyPress = (key: string) => {
    if (inputValue.length < 4) setInputValue(inputValue + key);
  };

  const CustomKeyboard = ({ onSubmit }) => (
    <View style={styles.keyboardContainer}>
      <View style={styles.keyboardRow}>
        {[1, 2, 3].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleKeyPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.keyboardRow}>
        {[4, 5, 6].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleKeyPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.keyboardRow}>
        {[7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleKeyPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.keyboardRow}>
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.key}
          onPress={() => handleKeyPress("0")}
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={onSubmit}>
          <Text style={styles.keyText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isConnecting && (
        <Text style={styles.connectingText}>Serverga ulanmoqdaa...</Text>
      )}

      {isCameraVisible && (
        <View style={styles.cameraContainer}>
          <View style={styles.cameraContent}>
         
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraText}>Kamera Tasviri</Text>
              <TouchableOpacity onPress={hideCamera} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <Camera />
          </View>
        </View>
      )}
      {activeUser && (
        <View style={styles.activeUserContainer}>
          <Image
            source={{ uri: activeUser.image }}
            style={styles.activeUserImage}
            onError={() => console.error("Rasmni yuklashda xato:", activeUser.image)}
          />
          <Text style={styles.activeUserText}>{activeUser.email}</Text>
        </View>
      )}
        {tarix === false && (
        <View style={{width:'100%',height:'100%',backgroundColor:'#FEFF9F'}}>
          <TouchableOpacity style={{top:'10%',width:50,height:50,borderRadius:20,}} onPress={() => Tarix1()}>
            <Image style={{width:40,height:40,transform: [{ rotate: "270deg" }]}} source={require('../../../assets/upStop.png')}/>
          </TouchableOpacity>
          <View style={{width:'100%',height:'60%',top:'12%'}}>
            <Tarix11/>
          </View>
        </View>
      )}
      {tarix === true && <View>
      <Text style={styles.title}>Asosiy Boshqaruv</Text>
      <View style={{right:'5%',top:'2%'}}>
            <ErrorList  />
          </View>
       <View style={styles.bottomButtonRow}>
        <TouchableOpacity onPress={() => Tarix()} style={[styles.bottomButton1, { backgroundColor: "#D3EE98"}]}>
          <Text style={styles.buttonText}>Boshqaruv Tarixi</Text>
        </TouchableOpacity>
       </View>
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity
          onPress={Chastotnik1}
          style={[styles.bottomButton, { backgroundColor: "#D3EE98" }]}
        >
          <Image
            style={styles.buttonImage}
            source={require("../../../assets/chastotnik2.png")}
          />
          <Text style={styles.buttonText}>Chastotnik1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={Chastotnik2}
          style={[styles.bottomButton, { backgroundColor: "#D3EE98" }]}
        >
          <Image
            style={styles.buttonImage}
            source={require("../../../assets/chastotnik.png")}
          />
          <Text style={styles.buttonText}>Chastotnik2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showCamera}
          style={[styles.bottomButton, { backgroundColor: "#D3EE98" }]}
        >
          <Image
            style={styles.buttonImage}
            source={require("../../../assets/camera.png")}
          />
          <Text style={styles.buttonText}>Kamera</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TextInput
              style={[
                styles.input,
                hasError ? { borderColor: "red", color: "red" } : { borderColor: "#fff" },
              ]}
              value={inputValue}
              placeholder="0-5000"
              maxLength={4}
              editable={false}
            />
            {hasError && (
              <Text style={styles.errorText}>
                Xatolik: 5000 dan yuqori qiymat kiritolmaysiz
              </Text>
            )}
            <CustomKeyboard onSubmit={() => handleFrequencySubmit(1)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TextInput
              style={[
                styles.input,
                hasError ? { borderColor: "red", color: "red" } : { borderColor: "#fff" },
              ]}
              value={inputValue}
              placeholder="0-5000"
              maxLength={4}
              editable={false}
            />
            {hasError && (
              <Text style={styles.errorText}>
                Xatolik: 5000 dan yuqori qiymat kiritolmaysiz
              </Text>
            )}
            <CustomKeyboard onSubmit={() => handleFrequencySubmit(2)} />
          </View>
        </View>
      </Modal>

      <View style={[styles.buttonRow, { marginTop: height * 0.02 }]}>
        <View
          style={[
            styles.button,
            { backgroundColor: isSwitchOn ? "#72BF78" : "#D3EE98", flex: 0.9 },
          ]}
        >
          {isSwitchOn ? (
            <Image
              style={styles.buttonImage}
              source={require("../../../assets/lampaOn.png")}
            />
          ) : (
            <Image
              style={styles.buttonImage}
              source={require("../../../assets/lampaOff.png")}
            />
          )}
          <Text style={styles.buttonText}>
            {isSwitchOn ? "Chiroq yoqilgan" : "Chiroq O'chgan"}
          </Text>
          <TouchableOpacity
            onPress={toggleSwitch}
            activeOpacity={1}
            style={[
              styles.switchContainer,
              { backgroundColor: isSwitchOn ? "#fff" : "#f4f4f5" },
            ]}
          >
            <Animated.View
              style={[
                styles.slider,
                {
                  transform: [{ translateX }],
                  backgroundColor: isSwitchOn ? "#303136" : "#ff0080",
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.verticalButtonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPressed4 ? "#72BF78" : "#D3EE98" },
            ]}
            onPress={handleRestartPress}
            activeOpacity={1}
          >
            <Animated.Image
              style={[styles.buttonImage, { transform: [{ rotate }] }]}
              source={require("../../../assets/restart.png")}
            />
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPressed3 ? "#72BF78" : "#D3EE98" },
            ]}
            onPress={handleRejimPress}
            activeOpacity={1}
          >
            {isPressed3 ? (
              <Image
                style={styles.buttonImage}
                source={require("../../../assets/phone.png")}
              />
            ) : (
              <Image
                style={styles.buttonImage}
                source={require("../../../assets/drag.png")}
              />
            )}
            <Text style={styles.buttonText}>Rejim</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button,{ backgroundColor: isPressed1 ? "#72BF78" : "#D3EE98" },
          ]}
          onPressIn={handleUpPressIn}
          onPressOut={handleUpPressOut}
          activeOpacity={1}
        >
          {isPressed1 ? (
            <Image
              style={styles.buttonImage}
              source={require("../../../assets/up.gif")}
            />
          ) : (
            <Image
              style={styles.buttonImage}
              source={require("../../../assets/upStop.png")}
            />
          )}
          <Text style={styles.buttonText}>Yuqoriga</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,{ backgroundColor: isPressed2 ? "#72BF78" : "#D3EE98" },]}
          onPressIn={handleDownPressIn}
          onPressOut={handleDownPressOut}
          activeOpacity={1}
        >
          {isPressed2 ? (
            <Image
              style={[styles.buttonImage, { transform: [{ rotate: "180deg" }] }]}
              source={require("../../../assets/up.gif")}
            />
          ) : (
            <Image
              style={[styles.buttonImage, { transform: [{ rotate: "180deg" }] }]}
              source={require("../../../assets/upStop.png")}
            />
          )}
          <Text style={styles.buttonText}>Pastga</Text>
        </TouchableOpacity>
        </View>
      </View>}
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFF9F",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: height * 0.03,
    top: height * 0.04,
  },
  buttonRow: {
    top: height * 0.03,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.14,
    flexWrap: "wrap",
  },
  activeUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    position:'absolute',
    width:'100%',
    height:'8%',
    zIndex:9999,
    backgroundColor:'rgba(0,0,0,0.5)',
    borderRadius:10,
    top:'25%',
    left:'5.5%'
  },
  activeUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // 50% border-radius
    marginRight: 10,
  },
  activeUserText: {
    fontSize: 16,
    color: "#fff",
  },
  image:{width:50,height:50,borderRadius:50},
  verticalButtonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRadius: 10,
    marginHorizontal: width * 0.02,
    marginBottom: height * 0.015,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.15,
  },
  bottomButtonRow: {
    top: height * 0.03,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.01,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRadius: 10,
    marginHorizontal: width * 0.015,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.12,
  },
  bottomButton1: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRadius: 10,
    marginHorizontal: width * 0.015,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.002,
  },
  buttonImage: {
    width: width * 0.15,
    height: width * 0.15,
    marginBottom: height * 0.01,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.04,
    fontWeight: "600",
    textAlign: "center",
  },
  switchContainer: {
    width: width * 0.15,
    height: height * 0.04,
    borderRadius: 30,
    justifyContent: "center",
    padding: 4,
  },
  slider: {
    width: height * 0.03,
    height: height * 0.03,
    borderRadius: 20,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: width * 0.05,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: height * 0.02,
    width: "100%",
    borderRadius: 10,
    fontSize: width * 0.045,
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#000",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  keyboardContainer: {
    width: "100%",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: height * 0.01,
  },
  key: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.01,
  },
  keyText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  cameraContainer: {
    position: "absolute",
    top: '4%',
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: "box-none", // Allows touches to pass through to components below
  },
  cameraContent: {
    backgroundColor: "#f6fff8",

    width: "100%",
    height: height / 2.8,
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  
  },
  cameraText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#303136",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4444",
    borderRadius: 15,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Boshqaruv;