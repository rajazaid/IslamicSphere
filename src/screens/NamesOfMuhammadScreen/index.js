// src/screens/NamesOfMuhammadScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import namesOfMuhammadData from '../../../assets/names_of_moahmed.json';

const NamesOfMuhammadScreen = () => {
  return (
    <View style={darkTheme.container}>
      <Text style={darkTheme.title}>Names of Muhammad Screen</Text>
      {namesOfMuhammadData.map((name, index) => (
        <Text style={darkTheme.text} key={index}>{name}</Text>
      ))}
    </View>
  );
};

export default NamesOfMuhammadScreen;
