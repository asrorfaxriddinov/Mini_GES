import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Malumotlar = ({ route }) => {
 
  return (
    <View style={styles.container}>
    
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.03, // 3% of screen width
    paddingVertical: height * 0.05, // 2% of screen height
    backgroundColor: '#f6fff8',
  },
});

export default Malumotlar;