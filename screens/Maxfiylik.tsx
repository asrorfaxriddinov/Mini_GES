import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Profil = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Maxfiylik Sahifasi</Text>
      <Button title="Orqaga" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Profil;
