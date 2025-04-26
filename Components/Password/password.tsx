import React, { useState, useEffect } from "react";
import {  View,  TouchableOpacity,  StyleSheet,  Text,  Alert,  Image,  StatusBar,  Dimensions,  Animated,  Modal,  TextInput,  Platform,} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

interface CustomKeyboardProps {
  onLogin: () => void;
}
const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onLogin }) => {
  const [input, setInput] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const correctPassword = "1234";
  const shakeAnimation = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [id, setId] = useState("");
  const [step, setStep] = useState(1);
  const [isFingerprintPromptVisible, setIsFingerprintPromptVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const fetchData = async () => {
    try {
      const cachedEmail = await AsyncStorage.getItem("cachedEmail");
      if (cachedEmail) {
        setEmailVerified(true);
        setEmail(cachedEmail);
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      setEmailVerified(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    handleFingerprint();
  }, []); 

  useEffect(() => {
    if (input.length === 4) {
      const enteredPin = input.join("");
      if (enteredPin === correctPassword) {
        setIsError(false);
        setTimeout(() => onLogin(), 300);
      } else {
        setIsError(true);
        Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 15, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -30, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 30, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -30, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start(() => {
          setTimeout(() => {
            setInput([]);
            setIsError(false);
          }, 2000);
        });
        Alert.alert("Xatolik", "Noto'g'ri PIN kod kiritildi.");
      }
    }
  }, [input, onLogin, shakeAnimation]);

  useEffect(() => {
    const sendApiRequest = () => {
      fetch("http://54.93.213.231:9090/python_bool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "bool_python", value: true }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    };
    sendApiRequest();
  }, []);

  const handlePress = (value: string) => {
    if (input.length < 4) setInput((prev) => [...prev, value]);
  };

  const handleDelete = () => {
    if (input.length > 0) {
      setInput((prev) => prev.slice(0, -1));
      setIsError(false);
    }
  };

  const handleFingerprint = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Xatolik", "Ushbu qurilmada barmoq izi skaneri mavjud emas");
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Xatolik", "Barmoq izi sozlamalari mavjud emas");
        return;
      }
      setIsFingerprintPromptVisible(true);
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Barmoq izini tasdiqlang",
        fallbackLabel: "PIN kodni ishlating",
        disableDeviceFallback: false,
      });
      setIsFingerprintPromptVisible(false);
      if (result.success) onLogin();
    } catch (error) {
      console.error("Biometric error:", error);
      setIsFingerprintPromptVisible(false);
      Alert.alert("Xatolik", "Barmoq izi tasdiqlashda xatolik yuz berdi");
    }
  };
  const openModal = () => {
    setModalVisible(true);
    setStep(1);
    setEmail("");
    setFullName("");
    setManualEmail("");
    setId("");
    setSelectedImage(null);
    setImageUrl("");
  };
  const closeModal = () => {
    setModalVisible(false);
    setStep(1);
    setEmail("");
    setFullName("");
    setManualEmail("");
    setId("");
    setSelectedImage(null);
    setImageUrl("");
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Xatolik", "Galereyaga kirish uchun ruxsat kerak!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Xatolik", "Iltimos, avval rasm tanlang!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "android" ? selectedImage : selectedImage.replace("file://", ""),
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);

      const response = await axios.post(
        "http://54.93.213.231:9090/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
        }
      );

      if (response.data.file_url) {
        setImageUrl(response.data.file_url);
        setStep(2);
      } else {
        Alert.alert("Xatolik", "Rasm yuklashda xatolik yuz berdi: Server javobi noto'g'ri");
      }
    } catch (error) {
      console.error("Rasm yuklash xatosi:", error.response?.data || error.message);
      Alert.alert(
        "Xatolik",
        "Rasm yuklashda xatolik: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const handleNext = async () => {
    if (email.trim() === "" || fullName.trim() === "") {
      Alert.alert("Xatolik", "Iltimos, email va ismingizni kiriting");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Xatolik", "Iltimos, to‘g‘ri email manzil kiriting");
      return;
    }
    try {
      console.log("Sending payload to /register:", { email, image: imageUrl, full_name: fullName });
      const response = await axios.post(
        "http://54.93.213.231:9090/register",
        { email, image: imageUrl, full_name: fullName },
        { timeout: 5000 }
      );
      if (response.status === 200) {
        setStep(3);
      } else {
        Alert.alert("Xatolik", `Serverdan kutilmagan javob: ${response.status}`);
      }
    } catch (error) {
      console.error("So‘rov xatosi:", error.response?.data || error.message);
      Alert.alert(
        "Xatolik",
        "Server bilan bog‘lanishda xatolik: " + (error.response?.data?.message || error.message)
      );
    }
  };
  const handleGoo = async () => {
    if (manualEmail.trim() === "" || id.trim() === "") {
      Alert.alert("Xatolik", "Iltimos, email va ID ni kiriting");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(manualEmail)) {
      Alert.alert("Xatolik", "Iltimos, to‘g‘ri email manzil kiriting");
      return;
    }
    try {
      console.log("Sending payload to /confirm:", { email: manualEmail, id });
      const response = await axios.post(
        "http://54.93.213.231:9090/confirm",
        { email: manualEmail, id },
        { timeout: 5000 }
      );
      if (response.data.message === "Registration confirmed and data updated successfully") {
        await AsyncStorage.setItem("cachedEmail", manualEmail);
        await AsyncStorage.setItem("cachedId", id);
        Alert.alert("Muvaffaqiyat", "Email va ID tasdiqlandi!");
        setEmailVerified(true);
        setEmail(manualEmail);
        closeModal();
      } else {
        Alert.alert("Xatolik", "Serverdan kutilmagan javob olindi");
      }
    } catch (error) {
      console.error("Tasdiqlash xatosi:", error.response?.data || error.message);
      Alert.alert(
        "Xatolik",
        "Server bilan bog‘lanishda xatolik: " + (error.response?.data?.message || error.message)
      );
    }
  };
  const numberButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image style={styles.GESlogo} source={require("../../assets/GESlogo.webp")} />
      </View>
      <Animated.View style={[styles.circleContainer, { transform: [{ translateX: shakeAnimation }] }]}>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.circle,
                index < input.length && { backgroundColor: isError ? "#f44336" : "#4CAF50" },
              ]}
            />
          ))}
      </Animated.View>

      <StatusBar
        barStyle={modalVisible || isFingerprintPromptVisible ? "light-content" : "dark-content"}
        backgroundColor={
          modalVisible || isFingerprintPromptVisible ? "rgba(0, 0, 0, 0.6)" : "transparent"
        }
        translucent
        hidden={false}
      />

      <View style={styles.keyboardContainer}>
        <View style={styles.keyboard}>
          {numberButtons.map((button) => (
            <TouchableOpacity key={button} style={styles.button} onPress={() => handlePress(button)}>
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.iconButton} onPress={() => handleFingerprint()}>
            <Image
              style={{ width: 45, height: 45, tintColor: "#000" }}
              source={require("../../assets/fingerprint.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress("0")}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
            <Image
              style={{ width: 35, height: 35, tintColor: "#000" }}
              source={require("../../assets/backspace.png")}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={openModal}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign Up</Text>
            {step === 1 ? (
              <>
                <TouchableOpacity style={styles.nextButton} onPress={pickImage}>
                  <Text style={styles.nextButtonText}>Rasm tanlang</Text>
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 100, height: 100, marginVertical: 10 }}
                  />
                )}
                <TouchableOpacity
                  style={[styles.nextButton, !selectedImage && { opacity: 0.5 }]}
                  onPress={uploadImage}
                  disabled={!selectedImage}
                >
                  <Text style={styles.nextButtonText}>Rasmni yuborish</Text>
                </TouchableOpacity>
              </>
            ) : step === 2 ? (
              <>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Ismingizni kiriting"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
                <TextInput
                  style={styles.emailInput}
                  placeholder="Email manzilingizni kiriting"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Email manzilingizni kiriting"
                  placeholderTextColor="#999"
                  value={manualEmail}
                  onChangeText={setManualEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.emailInput}
                  placeholder="ID ni kiriting"
                  placeholderTextColor="#999"
                  value={id}
                  onChangeText={setId}
                  keyboardType="default"
                />
                <TouchableOpacity style={styles.nextButton} onPress={handleGoo}>
                  <Text style={styles.nextButtonText}>Goo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  imageButton: {
    backgroundColor: "#4361ee",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  previewImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  GESlogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  circleContainer: {
    position: "absolute",
    top: "43%",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  circle: {
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
    backgroundColor: "#ccc",
    marginHorizontal: width * 0.025,
  },
  keyboardContainer: {
    position: "absolute",
    top: "68%",
    transform: [{ translateY: -height * 0.2 }],
    width: "100%",
    alignItems: "center",
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
  },
  button: {
    width: width * 0.2,
    height: width * 0.2,
    margin: width * 0.015,
    backgroundColor: "#d8f3dc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconButton: {
    width: width * 0.2,
    height: width * 0.2,
    margin: width * 0.015,
    backgroundColor: "#95d5b2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: width * 0.06,
    color: "#000",
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: height * 0.02,
  },
  signUpText: {
    color: "#4361ee",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: width * 0.85,
    padding: width * 0.05,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.03,
  },
  emailInput: {
    width: "100%",
    height: height * 0.06,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.04,
    color: "#333",
    marginBottom: height * 0.03,
  },
  nextButton: {
    backgroundColor: "#4361ee",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default CustomKeyboard;