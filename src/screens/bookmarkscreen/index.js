// BookmarksScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = JSON.parse(await AsyncStorage.getItem('bookmarks')) || [];
      setBookmarks(storedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const playAudio = async (audioUrl) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isPlaying) {
        sound.unloadAsync();
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {bookmarks.length > 0 ? (
        bookmarks.map((ayahNumber, index) => (
          <View key={index} style={styles.ayahContainer}>
            <Text style={styles.ayahText}>{`Ayah Number: ${ayahNumber}`}</Text>
            <Button
              title="Play Audio"
              onPress={() => playAudio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`)}
            />
          </View>
        ))
      ) : (
        <Text>No bookmarks available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
    padding: 10,
  },
  ayahContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#323232', // Darker card background color
    borderRadius: 8,
  },
  ayahText: {
    color: '#ffffff', // White text color
    fontSize: 16,
  },
});

export default BookmarksScreen;
