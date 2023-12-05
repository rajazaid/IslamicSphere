// src/screens/NamesOfAllahScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AudioPlayer from '../../components/AudioPlayer';
import { Audio } from 'expo-av';

const NamesOfAllahScreen = () => {
  const [namesOfAllahData, setNamesOfAllahData] = useState([]);

  useEffect(() => {
    // Load data from the JSON file
    const fetchData = async () => {
      try {
        const response = await require('../../../assets/names_of_allah.json');
        setNamesOfAllahData(response.data);
      } catch (error) {
        console.error('Error loading Names of Allah data:', error);
      }
    };

    fetchData();
  }, []);

  const playAudio = async () => {
    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync(require('../../../assets/Allah-names.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((name, index) => (
        <TouchableOpacity
          key={index}
          style={styles.nameItem}
          onPress={playAudio}
        >
          <Text style={styles.name}>{name.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const keyExtractor = (item, index) => index.toString();

  const renderSeparator = () => <View style={styles.separator} />;

  // Adjust the number of names per row as needed
  const namesPerRow = 10;

  const groupedData = namesOfAllahData.reduce((accumulator, currentValue, index) => {
    const rowIndex = Math.floor(index / namesPerRow);

    if (!accumulator[rowIndex]) {
      accumulator[rowIndex] = [];
    }

    accumulator[rowIndex].push(currentValue);
    return accumulator;
  }, []);

  return (
    <View>
      <AudioPlayer audioFile={require('../../../assets/Allah-names.mp3')} />
      <FlatList
        data={groupedData}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row-reverse', // Display names from right to left
    justifyContent: 'space-between',
  },
  nameItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
};

export default NamesOfAllahScreen;
