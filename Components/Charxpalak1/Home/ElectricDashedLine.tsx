import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ElectricDashedLine = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const [rpmValue, setRpmValue] = useState(0); // Store rpm value from WebSocket

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://54.93.213.231:9090/micro_gs_data_blok_ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const rpm = data?.wind_controller?.rpm || 0; // Extract rpm safely
        setRpmValue(rpm); // Update state with rpm value
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close(); // Cleanup on unmount
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (rpmValue > 0) {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      ).start();
    } else {
      animation.setValue(0); // Reset animation when rpm is 0
    }
  }, [animation, rpmValue]);

  const DASHED_LINE_WIDTH = 80;
  const ELECTRIC_DASH_WIDTH = 20;

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DASHED_LINE_WIDTH - ELECTRIC_DASH_WIDTH],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  // Determine colors based on rpmValue
  const lineColor = rpmValue === 0 ? '#FF0000' : '#00FF00'; // Red if 0, Green if > 0

  return (
    <View style={styles.container}>
      <View style={[styles.dashedLine, { borderColor: lineColor }]} />
      {rpmValue > 0 ? (
        <Animated.View
          style={[
            styles.electricDash,
            {
              transform: [{ translateX }],
              opacity,
              backgroundColor: lineColor,
            },
          ]}
        />
      ) : (
        <View style={[styles.electricDash, { backgroundColor: lineColor }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  dashedLine: {
    width: 80,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  electricDash: {
    width: 20,
    height: 4,
    position: 'absolute',
    borderRadius: 2,
  },
});

export default ElectricDashedLine;