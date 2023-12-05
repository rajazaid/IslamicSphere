// src/screens/BookmarkScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const BookmarkScreen = ({ bookmarks }) => {
  const renderBookmarkItem = ({ item }) => (
    <View style={styles.hadithItem}>
      <Text style={styles.info}>{item.info}</Text>
      <Text style={styles.narratedBy}>{item.by}</Text>
      <Text style={styles.hadithText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>hello</Text>
      <Text style={styles.title}>Bookmarks</Text>
      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No bookmarks yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
});

export default BookmarkScreen;
