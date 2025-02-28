import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomKeyboard = () => {
  const [input, setInput] = useState<string[]>([]); // Kiritilgan raqamlar
  const [display, setDisplay] = useState<string[]>([]); // Ko‘rsatiladigan qiymatlar

  // Raqam kiritilganda
  const handlePress = (value: string) => {
    if (input.length < 4) { // Maksimal 4 ta raqam
      const newInput = [...input, value];
      setInput(newInput);

      // Oldingi raqamlarni nuqta sifatida, yangi raqamni ko‘rsatish
      const newDisplay = newInput.map((item, index) =>
        index === newInput.length - 1 ? item : '•'
      );
      setDisplay(newDisplay);

      // 10ms dan keyin yangi raqamni nuqtaga aylantirish
      setTimeout(() => {
        setDisplay((prev) => prev.map(() => '•'));
      }, 200);
    }
  };

  // O‘chirish tugmasi
  const handleDelete = () => {
    if (input.length > 0) {
      const newInput = input.slice(0, -1);
      setInput(newInput);
      setDisplay(newInput.map(() => '•')); // O‘chirilganda faqat nuqtalar ko‘rinadi
    }
  };

  // Barmoq izi tugmasi
  const handleFingerprint = () => {
    Alert.alert('Barmoq izi', 'Barmoq izi tekshirildi (simulyatsiya)');
  };

  // Klaviatura tugmalari (1-9)
  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.container}>
      {/* Kiruvchi matnni ko‘rsatish */}
      <View style={styles.inputContainer}>
        {display.map((char, index) => (
          <Text key={index} style={styles.inputText}>
            {char}
          </Text>
        ))}
      </View>

      {/* Klaviatura */}
      <View style={styles.keyboard}>
        {/* 1-9 raqamlari */}
        {numberButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handlePress(button)}
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}

        {/* 9 dan keyin barmoq izi */}
        <TouchableOpacity style={styles.iconButton} onPress={handleFingerprint}>
          <Icon name="fingerprint" size={40} color="#fff" />
        </TouchableOpacity>

        {/* Barmoq izidan keyin 0 */}
        <TouchableOpacity style={styles.button} onPress={() => handlePress('0')}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>

        {/* Oxirida backspace */}
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Icon name="backspace" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputText: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 5, // Har bir son/nuqta orasida 10px
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
  button: {
    width: 80,
    height: 80,
    margin: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconButton: {
    width: 80,
    height: 80,
    margin: 5,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomKeyboard;