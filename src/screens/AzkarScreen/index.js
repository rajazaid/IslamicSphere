// src/screens/AzkarScreen.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

const azkarData = [
  {
    "category": "أذكار الصباح",
    "count": "1",
    "description": "من قالها حين يصبح أجير من الجن حتى يمسى ومن قالها حين يمسى أجير من الجن حتى يصبح.",
    "reference": "[آية الكرسى - البقرة 255].",
    "zekr": "أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ\nاللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.\n[آية الكرسى - البقرة 255]."
  },
  // Add more data for different categories
];

const AzkarScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.azkarItem}>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.zekr}>{item.zekr}</Text>
      <Text style={styles.reference}>{item.reference}</Text>
    </View>
  );

  const keyExtractor = (item) => item.category;

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={azkarData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = {
  container: {
    padding: 20,
  },
  azkarItem: {
    paddingBottom: 20,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  zekr: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2ecc71',
    marginBottom: 10,
  },
  reference: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#e74c3c',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
};

export default AzkarScreen;
