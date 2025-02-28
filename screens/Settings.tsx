import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedSettingsIcon from "./iconsettings";
import { useTranslation } from "react-i18next";
import i18next from "../src/i18next/i18n";
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from './types';
const { width, height } = Dimensions.get("window");

type ProfilProps = {
  imageUri: string;
  onImageChange: (newUri: string) => void;
};

const Profil: React.FC<ProfilProps> = ({ imageUri, onImageChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("O'zbek");
  const [stadiums, setStadiums] = useState([]);
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  // Tilni yuklash
  useEffect(() => {
    const getStoredLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
        i18next.changeLanguage(storedLanguage);
      }
    };
    getStoredLanguage();
  }, []);
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
    await AsyncStorage.setItem("selectedLanguage", language);
    i18next.changeLanguage(language);
  };

  const getFlagImage = () => {
    switch (selectedLanguage) {
      case "O'zbek":
        return require("./assets/uzb.jpg");
      case "Русский":
        return require("./assets/russia.jpg");
      case "English":
        return require("./assets/english.webp");
      default:
        return require("./assets/uzb.jpg");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.topBackground}
        source={require("./assets/fussballfeldhintergrund-mit-farbverlauf_23-2149017952.png")}
      >
        <View style={styles.animatedIcon}>
          <AnimatedSettingsIcon />
        </View>
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsText}>{t("settings")}</Text>
        </View>
      </ImageBackground>
      <ImageBackground
        style={styles.bottomBackground}
        source={require("./assets/image_2025-01-13_13-26-44.jpg")}
      >
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            style={styles.languageContainer}
          >
            <Image
              source={require("./assets/language.png")}
              style={styles.languageIcon}
            />
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              style={styles.languageTextContainer}
            >
              <Text style={styles.languageText}>{selectedLanguage}</Text>
              <TouchableOpacity
                style={styles.dropdownIcon}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  source={require("./assets/top.png")}
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
              <Image source={getFlagImage()} style={styles.flagIcon} />
            </TouchableOpacity>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View
              style={{
                position: "absolute", // Absolute position qo'shildi
                width: 80,
                height: 100,
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 10,
                left: "77%",
                top: height * 0.06, // Top qiymati aniq belgilandi
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                zIndex: 1, // Boshqa elementlar ustida ko'rinishi uchun
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 6 }}
                onPress={() => handleLanguageChange("O'zbek")}
              >
                <Text style={{ right: "30%" }}>UZ</Text>
                <Image
                  source={require("./assets/uzb.jpg")}
                  style={styles.flagIcon1}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 9 }}
                onPress={() => handleLanguageChange("Русский")}
              >
                <Text style={{ right: "30%" }}>RU</Text>
                <Image
                  source={require("./assets/russia.jpg")}
                  style={styles.flagIcon1}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 9 }}
                onPress={() => handleLanguageChange("English")}
              >
                <Text style={{ right: "30%" }}>EN</Text>
                <Image
                  source={require("./assets/english.webp")}
                  style={styles.flagIcon1}
                />
              </TouchableOpacity>
            </View>
          )}
          {stadiums.length > 0 && (
            <View>
              <Text>Stadiums Loaded: {stadiums.length}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.languageContainer}>
            <Image
              source={require("./assets/holat.png")}
              style={styles.languageIcon}
            />
            <TouchableOpacity style={styles.languageTextContainer}>
              <Text style={styles.languageText}>{t("Holatni")}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageContainer}>
            <Image
              source={require("./assets/kun.png")}
              style={styles.languageIcon}
            />
            <TouchableOpacity style={styles.languageTextContainer}>
              <Text style={styles.languageText}>{t("Tungi")}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageContainer}>
            <Image
              source={require("./assets/tahrir.png")}
              style={styles.languageIcon}
            />
            <TouchableOpacity style={styles.languageTextContainer}>
              <Text style={styles.languageText}>{t("tahrirlash")}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EditPassword')}  style={styles.languageContainer}>
            <Image
              source={require("./assets/parol.png")}
              style={styles.languageIcon}
            />
            <TouchableOpacity onPress={() => navigation.navigate('EditPassword')} style={styles.languageTextContainer}>
              <Text style={styles.languageText}>{t("Parol")} </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
  },
  animatedIcon: {
    marginTop: height * 0.05,
  },
  settingsTextContainer: {
    marginBottom: height * 0.05,
  },
  settingsText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
  },
  bottomBackground: {
    flex: 1.3,
  },
  content: {
    margin: width * 0.03,
  },
  languageContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: height * 0.05,
    marginVertical: height * 0.01,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  languageIcon: {
    width: width * 0.08,
    height: width * 0.08,
    marginLeft: "5%",
  },
  languageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  languageText: {
    fontSize: width * 0.045,
    color: "#fff",
    fontWeight: "bold",
    left: "10%",
  },
  dropdownIcon: {
    position: "absolute",
    right: "25%",
    transform: [{ rotate: "270deg" }],
  },
  arrowIcon: {
    width: width * 0.09,
    height: height * 0.03,
  },
  flagIcon: {
    width: width * 0.1,
    height: height * 0.03,
    position: "absolute",
    right: "5%",
  },
  flagIcon1: {
    width: width * 0.1,
    height: height * 0.03,
    position: "absolute",
    right: "5%",
  },
});

export default Profil;
