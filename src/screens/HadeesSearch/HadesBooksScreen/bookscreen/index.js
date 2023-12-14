
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const HadithBookScreen = ({ route }) => {
  const { book } = route.params;
  const [hadithData, setHadithData] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await require(`../../../../../assets/sahih_al_bukhari.json`);
        setHadithData(response);
        console.log(hadithData[0])
      } catch (error) {
        console.error(`Error loading Hadith data for ${book.title}:`, error);
      }
    };

    fetchData();
  }, [book]);

  useEffect(() => {

    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks');
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, []);

  const saveBookmarks = async (updatedBookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const toggleBookmark = (hadith) => {
    const isBookmarked = bookmarks.some((bookmark) => bookmark.info === hadith.info);

    if (isBookmarked) {
      
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.info !== hadith.info);
      saveBookmarks(updatedBookmarks);
    } else {
      
      const updatedBookmarks = [...bookmarks, hadith];
      saveBookmarks(updatedBookmarks);
    }
  };

  const filterHadithsByChapterAndKeyword = () => {
    let filteredHadiths = hadithData[0].books.flatMap((book) => book.hadiths);
console.log(selectedChapter)
    if (selectedChapter) {
      filteredHadiths = filteredHadiths.filter((hadith) => hadith.info.includes(selectedChapter));
    }

    if (keyword) {
      filteredHadiths = filteredHadiths.filter(
        (hadith) => hadith.info.includes(keyword) || hadith.text.includes(keyword)
      );
    }

    return filteredHadiths;
  };

  const renderHadithItem = ({ item }) => (
    <View style={styles.hadithItem}>
      <Text style={styles.info}>{item.info}</Text>
      <Text style={styles.narratedBy}>{item.by}</Text>
      <Text style={styles.hadithText}>{item.text}</Text>
      {/* <TouchableOpacity onPress={() => toggleBookmark(item)}>
        <Text
          style={[
            styles.bookmarkButton,
            bookmarks.some((bookmark) => bookmark.info === item.info) && styles.bookmarked,
          ]}
        >
          {bookmarks.some((bookmark) => bookmark.info === item.info) ? 'Bookmarked' : 'Bookmark'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );

  // Use the useNavigation hook to get the navigation object
  const navigation = useNavigation();

  // Function to navigate to the BookmarkScreen
  const navigateToBookmarks = () => {
    navigation.navigate("Hadithbookmark");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Picker
        selectedValue={selectedChapter}
        onValueChange={(itemValue) => setSelectedChapter(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Chapters" value="" />
        <Picker.Item label="Revelation" value="Revelation" />
        
        <Picker.Item label="Belief" value="Belief" />
        <Picker.Item label="Knowledge" value="Knowledge" />
        <Picker.Item label="Ablution" value="Ablution" />
        <Picker.Item label="Bathing" value="Bathing" />
        <Picker.Item label="Menstrual Periods" value="Menstrual Periods" />
        <Picker.Item label="Ablution with dust" value="Ablution with dust" />
        <Picker.Item label="Prayer" value="Prayer" />
        <Picker.Item label="Prayer Hall" value="Prayer Hall" />
        <Picker.Item label="Times of the Prayer" value="Times of the Prayer" />
        <Picker.Item label="Call to Prayer" value="Call to Prayer" />
        <Picker.Item label="Characteristics of Prayer" value="Characteristics of Prayer" />
        
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter keyword"
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      {hadithData.length > 0 ? (
        <FlatList
          data={filterHadithsByChapterAndKeyword()}
          renderItem={renderHadithItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      {/* Add a button to navigate to the BookmarkScreen */}
      {/* <Button
        title="View Bookmarks"
        onPress={navigateToBookmarks}
        buttonStyle={styles.viewBookmarksButton}
        containerStyle={styles.viewBookmarksButtonContainer}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#006400',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    
  },
  picker: {
    backgroundColor:'#fff5ee',
    marginBottom: 10,
    borderRadius:8,
  },
  input: {
    height: 40,
    backgroundColor:'#fff5ee',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 8,
    borderRadius:8,
  },
  hadithItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  info: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'gray',
  },
  narratedBy: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'green',
  },
  hadithText: {
    fontSize: 16,
    color: '#333',
  },
  bookmarkButton: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 10,
  },
  bookmarked: {
    color: 'green',
  },
  viewBookmarksButtonContainer: {
    marginVertical: 10,
    width: '50%', 
    alignSelf: 'center',
  },
  viewBookmarksButton: {
    backgroundColor: '#3498db',
  },
});

export default HadithBookScreen;
