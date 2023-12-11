import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const SurahListScreen = () => {
  const [surahs, setSurahs] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSurah, setPlayingSurah] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/meta');
        setSurahs(response.data.data.surahs.references);
      } catch (error) {
        console.error('Error fetching Surahs:', error);
      }
    };

    fetchSurahs();
  }, []);

  const formatSurahNumber = (surahNumber) => {
    return surahNumber.toString().padStart(3, '0');
  };

  const playPauseSurah = async (surahNumber) => {
    const formattedSurahNumber = formatSurahNumber(surahNumber);

    if (sound && isPlaying && playingSurah === formattedSurahNumber) {
      await sound.pauseAsync();
      setIsPlaying(false);
      setPlayingSurah(null);
    } else {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: `https://download.quranicaudio.com/quran/abdullaah_alee_jaabir_studio/${formattedSurahNumber}.mp3` },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
      setPlayingSurah(formattedSurahNumber);
    }
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SurahDetail', { surah: item })}>
      <ListItem containerStyle={styles.listItemContainer} bottomDivider>
        <ListItem.Content style={styles.contentContainer}>
          <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={styles.englishName}>{item.englishName}</ListItem.Subtitle>
        </ListItem.Content>
        <TouchableOpacity onPress={() => playPauseSurah(item.number)}>
          {isPlaying && playingSurah === formatSurahNumber(item.number) ? (
            <Ionicons name="pause-circle-outline" size={44} color="#4CAF50" />
          ) : (
            <Ionicons name="play-circle-outline" size={44} color="#4CAF50" />
          )}
          <Text style={styles.playPauseButtonText}>{isPlaying && playingSurah === formatSurahNumber(item.number) ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderSurahItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d40', // Dark green background color
  },
  listItemContainer: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  englishName: {
    fontSize: 20,
    color: 'black',
    fontStyle: 'italic',
    fontWeight: '400', // White color
  },
  name: {
    fontSize: 24,
    color: '#4caf50',
    // fontFamily: 'ArabicFont', // Green color
  },
  playPauseButton: {
    fontSize: 18,
    color: '#4CAF50', // Light green color
  },
  playPauseButtonText: {
    fontSize: 18,
    color: '#4CAF50',
    marginLeft: 5,
  },
});

export default SurahListScreen;
