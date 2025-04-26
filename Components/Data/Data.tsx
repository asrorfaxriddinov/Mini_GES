import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DataTax = () => {
  const navigation = useNavigation();

  const spinValueYellow = useRef(new Animated.Value(0)).current;
  const spinValueRed = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;

  const sendApiRequest = (value: number) => {
    fetch('http://54.93.213.231:9090/minigs12_post', {
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
    const rotateYellow = () => {
      spinValueYellow.setValue(0);
      Animated.timing(spinValueYellow, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: t => t,
      }).start(() => rotateYellow());
    };

    const rotateRed = () => {
      spinValueRed.setValue(0);
      Animated.timing(spinValueRed, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: t => t,
      }).start(() => rotateRed());
    };

    rotateYellow();
    rotateRed();

    return () => {
      spinValueYellow.stopAnimation();
      spinValueRed.stopAnimation();
    };
  }, [spinValueYellow, spinValueRed]);

  useEffect(() => {
    Animated.loop(
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
    ).start();
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
            sendApiRequest(2); // Send value 1 for yellow button
            navigation.navigate('MainTabs2');
          }}
        >
          <View style={styles.yellowContent}>
            <Animated.Image
              style={[styles.yellowImage, { transform: [{ rotate: spinYellow }] }]}
              source={require('../../assets/charxSariq1.png')}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Yellow Scoop Water Wheel</Text>
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
            sendApiRequest(1); // Send value 2 for red button
            navigation.navigate('MainTabs');
          }}
        >
          <View style={[styles.yellowContent, { marginTop: '2%' }]}>
            <Text style={[styles.buttonText, { color: '#abff4f' }]}>Red Scoop Water Wheel</Text>
            <Animated.Image
              style={[styles.yellowImage, { transform: [{ rotate: spinRed }] }]}
              source={require('../../assets/charxqizil.png')}
              resizeMode="contain"
            />
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
  yellowImage: {
    width: width * 0.4,
    height: height * 0.25,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
});

export default DataTax;