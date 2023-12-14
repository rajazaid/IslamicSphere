// QuranScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Quran from '../QuranScreen';




const SurahComponent = ({ surah, onPress }) => (
    
  <TouchableOpacity onPress={onPress} style={styles.surahContainer}>
    <Text style={styles.surahName}>{surah.name}</Text>
  </TouchableOpacity>
);

const AyahComponent = ({ ayah, onPlay, onBookmark }) => (
  <View style={styles.ayahContainer}>
    <Text style={styles.ayahText}>{ayah.text}</Text>
    <TouchableOpacity onPress={onPlay}>
      <Text style={styles.playButton}>Play Audio</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onBookmark}>
      <Text style={styles.bookmarkButton}>Bookmark</Text>
    </TouchableOpacity>
  </View>
);

const QuranScreen = () => {

    const navigation = useNavigation();
  const [quranData, setQuranData] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [sound, setSound] = useState();

  useEffect(() => {
    fetchData();
    selectedSurah(Quran)
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://api.alquran.cloud/v1/quran/ar.alafasy');
      const responseData = response.data?.data?.surahs;

      if (responseData && Array.isArray(responseData)) {
        setQuranData(responseData);
      } else {
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching Quran data:', error);
    }
  };

  const playAudio = async (audioUrl) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  const handleBookmark = async (ayahNumber) => {
    try {
      const bookmarks = JSON.parse(await AsyncStorage.getItem('bookmarks')) || [];
      const isBookmarked = bookmarks.includes(ayahNumber);

      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((item) => item !== ayahNumber);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      } else {
        bookmarks.push(ayahNumber);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error managing bookmarks:', error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  const navigateToBookmarks = () => {
    navigation.navigate('Bookmark'); 
  };
  return (
    <ScrollView style={styles.container}>
     <TouchableOpacity onPress={navigateToBookmarks} style={styles.bookmarkNavigator}>
        <Text style={styles.bookmarkNavigatorText}>View Bookmarks</Text>
      </TouchableOpacity>


      {/* Render Ayahs based on the selected Surah */}
      {selectedSurah && Array.isArray(selectedSurah.ayahs) && (
        <View style={styles.ayahsContainer}>
          {selectedSurah.ayahs.map((ayah, ayahIndex) => (
            <AyahComponent
              key={ayahIndex}
              ayah={ayah}
              onPlay={() => playAudio(ayah.audio)}
              onBookmark={() => handleBookmark(ayah.number)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    padding: 10,
  },
  surahContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#323232', 
    borderRadius: 8,
  },
  surahName: {
    color: '#03a9f4', 
    fontSize: 20,
    fontWeight: 'bold',
  },
  ayahsContainer: {
    marginTop: 20,
  },
  ayahContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#323232', 
    borderRadius: 8,
  },
  ayahText: {
    color: '#ffffff', 
    fontSize: 16,
  },
  playButton: {
    color: '#03a9f4',
    fontSize: 14,
    marginTop: 5,
  },
  bookmarkButton: {
    color: '#03a9f4', 
    fontSize: 14,
    marginTop: 5,
  },
  bookmarkButton: {
    color: '#03a9f4', 
    fontSize: 14,
    marginTop: 5,
  },
  bookmarkNavigator: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#03a9f4', 
    borderRadius: 8,
  },
  bookmarkNavigatorText: {
    color: '#ffffff', 
    fontSize: 16,
  },
});

export default QuranScreen;
