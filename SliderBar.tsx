import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SliderBarProps {
  isOpen: boolean;
}

const SliderBar: React.FC<SliderBarProps> = ({ isOpen }) => {
  // Yon tomondan chiqadigan animatsiya
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(isOpen ? 0 : -300, {
          duration: 300, // 300ms davom etadi
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.slider, animatedStyle]}>
      <Text style={styles.text}>This is a SliderBar!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: 300, // Slider kengligi
    height: '100%', // Ekran balandligi
    backgroundColor: 'blue', // Orqa fon rangi
    position: 'absolute', // Joylashuvni boshqarish uchun absolute
    top: 0, // Ekranning yuqori qismidan boshlash
    left: 0, // Chap tomondan chiqishi uchun left = 0
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Har doim yuqorida bo'lishi uchun
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default SliderBar;
