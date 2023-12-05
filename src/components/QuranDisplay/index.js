// src/components/QuranDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const QuranDisplay = ({ surahNumber, ayahNumber }) => {
  const [verse, setVerse] = useState('');

  useEffect(() => {
    fetchQuranVerse(surahNumber, ayahNumber);
  }, [surahNumber, ayahNumber]);

  const fetchQuranVerse = async (surahNumber, ayahNumber) => {
    try {
      const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`);
      const { data } = response.data;
      setVerse(data.text);
    } catch (error) {
      console.error('Error fetching Quranic verse:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.verse}>{verse}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verse: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default QuranDisplay;
