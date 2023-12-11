import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useEffect } from 'react';

const QuranSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAyahs = async () => {
    try {
      console.log('Search button pressed');
      setLoading(true);
      // Clear the previous results
      setAyahs([]);

      const response = await axios.get(
        keyword === undefined
          ? 'https://api.alquran.cloud/v1/search/mercy/all/en'
          : `https://api.alquran.cloud/v1/search/${keyword}/all/en`
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
    } finally {
      setLoading(false);
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
      <View style={styles.button}><Button title="Search" onPress={searchAyahs} color="#4CAF50" /></View>
      
      {loading && <ActivityIndicator size="large" color="#4CAF50" />}
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No Ayahs found</Text>}
        initialNumToRender={10} // Adjust as needed
        maxToRenderPerBatch={5} // Adjust as needed
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
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'white',
    borderRadius: 5,
    
  },
  itemContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
  verseText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  button:{
marginBottom:20,
  },
});

export default QuranSearch;
