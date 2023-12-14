
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const hadithBooks = [
  { id: 1, title: 'Sahih al-Bukhari', arabicTitle: 'صحيح البخاري', fileName: 'sahih_al_bukhari.json' },
  { id: 2, title: 'Sahih Muslim', arabicTitle: 'صحيح مسلم', fileName: 'sahih_muslim.json' },
  { id: 3, title: 'Sunan Nasai', arabicTitle: 'سنن النسائي', fileName: 'sahih_muslim.json' },
  { id: 4, title: 'Abu Dawood', arabicTitle: 'سنن أبي داود', fileName: 'sahih_muslim.json' },
  { id: 5, title: 'Jami at-Tirmidhi', arabicTitle: 'جامع الترمذي', fileName: 'sahih_muslim.json' },
  { id: 6, title: 'Sunan ibn Majah', arabicTitle: 'سنن ابن ماجه', fileName: 'sahih_muslim.json' },
 
];

const HadithBooksScreen = ({ navigation }) => {
  const handleBookPress = (book) => {

    navigation.navigate('HadeesBook', { book });
  };

  const renderBookButton = ({ item }) => (
    <TouchableOpacity style={styles.bookButton} onPress={() => handleBookPress(item)}>
      <Text style={styles.buttonText}>{item.title}</Text>
      <Text style={styles.arabicText}>{item.arabicTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hadithBooks}
        renderItem={renderBookButton}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
  },
  listContainer: {
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  bookButton: {
    backgroundColor: '#006400',
    height: 170,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arabicText: {
    color: 'white',
    marginTop:50,
    fontSize: 20,
    fontStyle: 'italic',
  },
});

export default HadithBooksScreen;
