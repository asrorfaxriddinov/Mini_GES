import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DataTax = () => {
  const navigation = useNavigation();

  const spinValueYellow = useRef(new Animated.Value(0)).current;
  const spinValueRed = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const [yellowRpm, setYellowRpm] = useState(0);
  const [redRpm, setRedRpm] = useState(0);
  const [kuchlanish, setKuchlanish] = useState(0);
  const [tok, setTok] = useState(0);
  const [quvvat, setQuvvat] = useState(0);
  const [umumiyquvvat, setUmumiyquvvat] = useState(0);
  const [kuchlanish1, setKuchlanish1] = useState(0);
  const [tok1, setTok1] = useState(0);
  const [quvvat1, setQuvvat1] = useState(0);
  const [umumiyquvvat1, setUmumiyquvvat1] = useState(0);

  const sendApiRequest = (value) => {
    fetch('http://0.0.0.0:9090/minigs12_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'minigs12',
        value: value,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    const wsYellow = new WebSocket('ws://0.0.0.0:9090/micro_gs_data_blok_ws1');
    const wsRed = new WebSocket('ws://0.0.0.0:9090/micro_gs_data_blok_ws');

    wsYellow.onopen = () => console.log('Yellow WebSocket connected');
    wsRed.onopen = () => console.log('Red WebSocket connected');

    wsYellow.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.wind_controller && typeof data.wind_controller.rpm === 'number') {
          setYellowRpm(data.wind_controller.rpm);
          setKuchlanish(data.wind_controller.genarator_voltage);
          setTok(data.wind_controller.generator_current);
          setQuvvat(Number(((data.wind_2['Active power'] / 1000) || 0).toFixed(1)));
          setUmumiyquvvat(Number(data.wind_2['Total generating capacity']));
        }
      } catch (error) {
        console.error('Error parsing yellow WebSocket data:', error);
      }
    };

    wsRed.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.wind_controller && typeof data.wind_controller.rpm === 'number') {
          setRedRpm(data.wind_controller.rpm);
          setKuchlanish1(data.wind_controller.genarator_voltage);
          setTok1(data.wind_controller.generator_current);
          setQuvvat1(Number(((data.wind_2['Active power'] / 1000) || 0).toFixed(1)));
          setUmumiyquvvat1(Number(data.wind_2['Total generating capacity']));
        }
      } catch (error) {
        console.error('Error parsing red WebSocket data:', error);
      }
    };

    wsYellow.onerror = (error) => console.error('Yellow WebSocket error:', error);
    wsRed.onerror = (error) => console.error('Red WebSocket error:', error);
    wsYellow.onclose = () => console.log('Yellow WebSocket closed');
    wsRed.onclose = () => console.log('Red WebSocket closed');

    return () => {
      wsYellow.close();
      wsRed.close();
    };
  }, []);

  // Yellow wheel animation
  useEffect(() => {
    let animation = null;
    if (yellowRpm > 0) {
      spinValueYellow.setValue(0);
      animation = Animated.loop(
        Animated.timing(spinValueYellow, {
          toValue: 1,
          duration: 3000, // Fixed duration as in original code
          useNativeDriver: true,
          easing: (t) => t, // Linear easing for constant speed
        })
      );
      animation.start();
    } else {
      spinValueYellow.stopAnimation();
      spinValueYellow.setValue(0); // Reset rotation
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [yellowRpm, spinValueYellow]);

  // Red wheel animation
  useEffect(() => {
    let animation = null;
    if (redRpm > 0) {
      spinValueRed.setValue(0);
      animation = Animated.loop(
        Animated.timing(spinValueRed, {
          toValue: 1,
          duration: 3000, // Fixed duration as in original code
          useNativeDriver: true,
          easing: (t) => t, // Linear easing for constant speed
        })
      );
      animation.start();
    } else {
      spinValueRed.stopAnimation();
      spinValueRed.setValue(0); // Reset rotation
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [redRpm, spinValueRed]);

  // Arrow animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateXValue, {
          toValue: 15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateXValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [translateXValue]);

  const spinYellow = spinValueYellow.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinRed = spinValueRed.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonYellow}
          onPress={() => {
            sendApiRequest(2);
            navigation.navigate('MainTabs2');
          }}
        >
          <View style={styles.yellowContent}>
            <View style={styles.imageContainer}>
              <Animated.Image
                style={[styles.yellowImage, { transform: [{ rotate: spinYellow }] }]}
                source={require('../../assets/charxSariq1.png')}
                resizeMode="contain"
              />
              {yellowRpm === 0 && (
                <Image
                  style={styles.exclamationImage}
                  source={require('../../assets/undov.png')}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.rpmText}>RPM: {yellowRpm}</Text>
            </View>
            <View>
              <Text style={[styles.buttonText, { top: '-8%', left: '-10%' }]}>Controller</Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', top: '-8%', left: '-10%' }}>
                <Text style={{ color: '#000', fontSize: 16 }}>Kuchlanish: {kuchlanish / 10} V</Text>
                <Text style={{ color: '#000', fontSize: 16 }}>Tok kuchi: {tok / 10} A</Text>
                <Text style={{ color: '#000', fontSize: 16 }}>Quvvat: {quvvat} kW</Text>
                <Text style={{ color: '#000', fontSize: 16 }}>Umumiy quvvat: {umumiyquvvat} kW</Text>
              </View>
            </View>
          </View>
          <View style={styles.yellowDetails}>
            <Text style={styles.descriptionText}>
              Sariq charxpalakni masofadan boshqarish va texnik malumotlarni kuzatish
            </Text>
            <View style={styles.moreContainer}>
              <Text style={styles.moreText}>Ko'proq</Text>
              <Animated.Image
                style={[
                  styles.arrowImage,
                  { transform: [{ translateX: translateXValue }, { rotate: '90deg' }] },
                ]}
                source={require('../../assets/upStop.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonRed}
          onPress={() => {
            sendApiRequest(1);
            navigation.navigate('MainTabs');
          }}
        >
          <View style={[styles.yellowContent, { marginTop: '-6%' }]}>
            <View>
              <Text style={[styles.buttonText, { color: '#abff4f', top: '-8%' }]}>Controller</Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', top: '-7%' }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Kuchlanish: {kuchlanish1 / 10} V</Text>
                <Text style={{ color: '#fff', fontSize: 16 }}>Tok kuchi: {tok1 / 10} A</Text>
                <Text style={{ color: '#fff', fontSize: 16 }}>Quvvat: {quvvat1} kW</Text>
                <Text style={{ color: '#fff', fontSize: 16 }}>Umumiy quvvat: {umumiyquvvat1} kW</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Animated.Image
                style={[styles.yellowImage, { transform: [{ rotate: spinRed }] }]}
                source={require('../../assets/charxqizil.png')}
                resizeMode="contain"
              />
              {redRpm === 0 && (
                <Image
                  style={styles.exclamationImage}
                  source={require('../../assets/undov1.png')}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.rpmText, { color: '#fdf0d5' }]}>RPM: {redRpm}</Text>
            </View>
          </View>
          <View style={styles.yellowDetails}>
            <Text style={[styles.descriptionText, { color: '#fdf0d5' }]}>
              Qizil charxpalakni masofadan boshqarish va texnik malumotlarni kuzatish
            </Text>
            <View style={styles.moreContainer}>
              <Text style={[styles.moreText, { color: '#abff4f' }]}>Ko'proq</Text>
              <Animated.Image
                style={[
                  styles.arrowImage,
                  { transform: [{ translateX: translateXValue }, { rotate: '90deg' }] },
                ]}
                source={require('../../assets/upStop.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  rpmText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#023047',
    textAlign: 'center',
    marginTop: '2%',
  },
  buttonYellow: {
    backgroundColor: '#ffb703',
    flex: 1,
    borderRadius: 0,
    padding: '2%',
  },
  yellowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '5%',
  },
  imageContainer: {
    position: 'relative',
  },
  yellowImage: {
    width: width * 0.4,
    height: height * 0.25,
  },
  exclamationImage: {
    position: 'absolute',
    width: 150,
    height: 150,
    top: '16%',
    left: '16%',
    transform: [{ translateX: -width * 0.05 }, { translateY: -height * 0.025 }],
  },
  buttonText: {
    color: '#219ebc',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
  },
  yellowDetails: {
    marginTop: '2%',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: width * 0.055,
    fontFamily: 'sans-serif',
    textAlign: 'center',
    color: '#023047',
    paddingHorizontal: '5%',
    flexWrap: 'wrap',
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
  },
  moreText: {
    fontSize: width * 0.05,
    color: '#1E90FF',
    marginRight: '2%',
  },
  arrowImage: {
    width: width * 0.15,
    height: height * 0.1,
  },
  buttonRed: {
    backgroundColor: '#FF0000',
    flex: 1,
    borderRadius: 0,
    padding: '2%',
  },
});

export default DataTax;