import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

type ProfilProps = {
  imageUri: string;
  onImageChange: (newUri: string) => void;
};

const Profil: React.FC<ProfilProps> = ({ imageUri, onImageChange }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const getStoredImage = async () => {
      const storedImage = await AsyncStorage.getItem('selectedImage');
      if (storedImage) {
        onImageChange(storedImage);
      }
    };
    getStoredImage();
  }, [onImageChange]);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets[0].uri) {
        const newUri = response.assets[0].uri;
        onImageChange(newUri);
        await AsyncStorage.setItem('selectedImage', newUri);
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profil sahifasi fokusta');
      return () => {
        console.log('Profil sahifasidan chiqildi');
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Yuqori qism (Profil rasmi va ism-familiya) */}
      <ImageBackground style={styles.topBackground} source={require('./assets/fussballfeldhintergrund-mit-farbverlauf_23-2149017952.png')}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image source={imageUri ? { uri: imageUri } : require('./assets/men.jpg')} style={styles.profileImage} />
        </TouchableOpacity>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>Asror</Text>
          <Text style={styles.profileTitle}>{t('Profil')}</Text>
        </View>
      </ImageBackground>

      {/* Pastki qism (Ikkinchi fon rasmi) */}
      <ImageBackground style={styles.bottomBackground} source={require('./assets/image_2025-01-13_13-26-44.jpg')}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('name')}</Text>
            <Text style={styles.infoValue}>Asror</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('surname')}</Text>
            <Text style={styles.infoValue}>Faxriddinov</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('email')}</Text>
            <Text style={styles.infoValue}>asrorfaxriddinov10@gmail.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('phone')}</Text>
            <Text style={styles.infoValue}>+998 33 5752</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('password')}</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('status')}</Text>
            <Text style={styles.infoValue}>User</Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.1,
    borderWidth: 2,
    borderColor: 'white',
    marginTop: height * 0.05,
  },
  profileTextContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  profileName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#000',
  },
  profileTitle: {
    fontSize: width * 0.05,
    color: '#000',
  },
  bottomBackground: {
    flex: 1.3,
    padding: width * 0.03,
  },
  infoContainer: {
    margin: width * 0.02,
  },
  infoRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: height * 0.05,
    marginVertical: height * 0.008,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    paddingLeft: width * 0.03,
  },
  infoLabel: {
    fontSize: width * 0.04,
    color: '#fff',
    flex: 1,
  },
  infoValue: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: width * 0.02,
    textAlign: 'center',
    flex: 2,
  },
});

export default Profil;
