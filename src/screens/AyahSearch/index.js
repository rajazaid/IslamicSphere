import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const QuranSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [ayahs, setAyahs] = useState([]);

  const searchAyahs = async () => {
    try {
      console.log('Search button pressed');
      // Clear the previous results
      setAyahs([]);

      const response = await axios.get(
        keyword==undefined?`https://api.alquran.cloud/v1/search/mercy/all/en`:`https://api.alquran.cloud/v1/search/${keyword}/all/en`
      );

      console.log('API Response:', response);

      if (response.data && response.data.data && response.data.data.matches) {
        // Extract Ayahs from the API response
        const newAyahs = response.data.data.matches;
        console.log('New Ayahs:', newAyahs);

        setAyahs(newAyahs);
      } else {
        console.error('Invalid API response format:', response.data);
        // Optionally, you can setAyahs([]) here to clear the FlatList in case of an error
      }
    } catch (error) {
      console.error('Error fetching Ayahs:', error.message);
      // Optionally, you can setAyahs([]) here to clear the FlatList in case of an error
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.verseText}>{item.text}</Text>
    </View>
  );

  console.log('Rendered with Ayahs:', ayahs);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter keyword"
        placeholderTextColor="#ccc"
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <Button title="Search" onPress={searchAyahs} color="#61dafb" />
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No Ayahs found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#004d40',
  },
  input: {
    height: 40,
    borderColor: '#61dafb',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'white',
    borderRadius:5,
  },
  Button:{
    marginBottom: 10,
  },
  itemContainer: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verseText: {
    fontSize: 16,
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default QuranSearch;
