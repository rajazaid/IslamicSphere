import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PrayerTrackerScreen = () => {
  const [prayerData, setPrayerData] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load prayer data from AsyncStorage on component mount
    loadPrayerData();
  }, []);

  useEffect(() => {
    // Update streaks when prayerData changes
    updateStreaks();
  }, [prayerData]);

  const loadPrayerData = async () => {
    try {
      const storedPrayerData = await AsyncStorage.getItem('prayerData');
      if (storedPrayerData) {
        setPrayerData(JSON.parse(storedPrayerData));
      }
    } catch (error) {
      console.error('Error loading prayer data:', error);
    }
  };

  const savePrayerData = async (newPrayerData) => {
    try {
      await AsyncStorage.setItem('prayerData', JSON.stringify(newPrayerData));
      setPrayerData(newPrayerData);
    } catch (error) {
      console.error('Error saving prayer data:', error);
    }
  };

  const updatePrayerStatus = (prayerName, date) => {
    setPrayerData((prevData) => {
      const updatedData = { ...prevData };

      if (!updatedData[date]) {
        updatedData[date] = {};
      }

      updatedData[date][prayerName] = !updatedData[date][prayerName];

      return updatedData;
    });
  };

  const updateStreaks = () => {
    const dates = Object.keys(prayerData);

    // Calculate current streak
    let currentStreakCount = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = dates[i];
      const isAllPrayersPerformed = PRAYER_NAMES.every(
        (prayerName) => prayerData[currentDate][prayerName]
      );

      if (isAllPrayersPerformed) {
        currentStreakCount++;
      } else {
        break; // Streak broken
      }
    }

    setCurrentStreak(currentStreakCount);

    // Calculate best streak
    let bestStreakCount = 0;
    let currentStreak = 0;

    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = dates[i];
      const isAllPrayersPerformed = PRAYER_NAMES.every(
        (prayerName) => prayerData[currentDate][prayerName]
      );

      if (isAllPrayersPerformed) {
        currentStreak++;
        bestStreakCount = Math.max(bestStreakCount, currentStreak);
      } else {
        currentStreak = 0; // Streak broken
      }
    }

    setBestStreak(bestStreakCount);
  };

  const renderPrayerButton = (prayerName) => {
    const isPrayerPerformed =
      prayerData[selectedDate]?.[prayerName] || false;

    return (
      <TouchableOpacity
        key={prayerName}
        style={[styles.prayerButton, isPrayerPerformed && styles.prayerPerformed]}
        onPress={() => updatePrayerStatus(prayerName, selectedDate)}
      >
        <Text style={styles.buttonText}>{prayerName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prayer Tracker</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#3498db' },
          ...Object.keys(prayerData).reduce((marked, date) => {
            marked[date] = { marked: true, dotColor: '#2ecc71' };
            return marked;
          }, {}),
        }}
      />
      <View style={styles.buttonsContainer}>
        {PRAYER_NAMES.map((prayerName) => renderPrayerButton(prayerName))}
      </View>
      <Text style={styles.streakText}>Current Streak: {currentStreak}</Text>
      <Text style={styles.streakText}>Best Streak: {bestStreak}</Text>
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
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  prayerButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  prayerPerformed: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default PrayerTrackerScreen;
