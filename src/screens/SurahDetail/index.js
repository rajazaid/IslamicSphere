import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const SurahDetailScreen = () => {
  const route = useRoute();
  const { surah } = route.params;
  const [keyword, setKeyword] = useState('');
  const [ayahs, setAyahs] = useState([]);
  const [filteredAyahs, setFilteredAyahs] = useState([]);

  const fetchAyahTranslation = async (ayahNumber) => {
    try {
      const translationResponse = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.asad`);
      return translationResponse.data.data.text;
    } catch (error) {
      console.error('Error fetching Ayah translation:', error);
      return 'Translation not available';
    }
  };

  useEffect(() => {
    const fetchAyahs = async () => {
      try {
        const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surah.number}`);
        const ayahsWithTranslations = await Promise.all(
          response.data.data.ayahs.map(async (ayah) => ({
            ...ayah,
            translation: await fetchAyahTranslation(ayah.number),
          }))
        );
        setAyahs(ayahsWithTranslations);
      } catch (error) {
        console.error('Error fetching Ayahs:', error);
      }
    };

    fetchAyahs();
  }, [surah]);

  useEffect(() => {
    // Filter Ayahs based on the keyword
    const filtered = ayahs.filter(
      (ayah) =>
        ayah.text.toLowerCase().includes(keyword.toLowerCase()) ||
        ayah.translation.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredAyahs(filtered);
  }, [keyword, ayahs]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Ayah by keyword"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <Card>
          <Card.Title>{surah.englishName}</Card.Title>
          <Card.Divider />
          <Text style={styles.translatedName}>{surah.name}</Text>
          {filteredAyahs.map((ayah) => (
            <Card key={ayah.number} containerStyle={styles.ayahCard}>
              <Text style={styles.ayahText}>{ayah.text}</Text>
              <Text style={styles.translationText}>{ayah.translation}</Text>
            </Card>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006400', // Dark green background color
  },
  translatedName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  ayahCard: {
    marginBottom: 15,
  },
  ayahText: {
    fontSize: 28,
    marginBottom: 5,
    color: 'black', 
    // fontFamily: 'ArabicFont', 
  },
  translationText: {    fontSize: 18,
    color: 'gray',
    fontStyle: 'italic', 
  },
  searchContainer: {
    padding: 10,
    marginBottom: 0,
    backgroundColor: '#006400', // White background color
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#006400', // Dark green background color
  },
});

export default SurahDetailScreen;

