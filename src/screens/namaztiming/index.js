import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const PrayerTimesApp = () => {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [reminders, setReminders] = useState({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        fetchPrayerTimes(location.coords);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    return () => {
      sound.current.unloadAsync(); // Unload the audio when the component unmounts
    };
  }, []);

  const fetchPrayerTimes = async (coords) => {
    try {
      const response = await axios.get('http://api.aladhan.com/v1/timings', {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          method: 5,
        },
      });

      const prayerTimes = response.data.data.timings;
      setPrayerTimes(prayerTimes);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleReminder = (prayer) => {
    setReminders((prevReminders) => ({
      ...prevReminders,
      [prayer]: !prevReminders[prayer],
    }));
  };

  const playAzan = async () => {
    try {
      await sound.current.loadAsync(require("../../../assets/azan3.mp3"));
      await sound.current.playAsync();
    } catch (error) {
      console.error("Error playing Azan", error);
    }
  };

  const PrayerCard = ({ title, time, prayer }) => (
    <View style={styles.prayerCard}>
      <Text style={styles.prayerCardText}>{title}</Text>
      <Text style={styles.prayerCardText}>{time}</Text>
      <TouchableOpacity onPress={() => toggleReminder(prayer)}>
        <Ionicons
          name={reminders[prayer] ? 'volume-high' : 'volume-mute'}
          size={24}
          color="#ffffff"
        />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    
    const interval = setInterval(() => {
     const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      console.log(currentTime)
      console.log(prayer => prayerTimes[prayer])
      if (prayerTimes && reminders[Object.keys(prayerTimes).find(prayer => prayerTimes[prayer] === "14:42")]) {
        
        playAzan();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes, reminders]);

  return (
    <View style={styles.container}>
      {prayerTimes && (
        <View style={styles.prayerTimesContainer}>
          <View style={styles.prayerCardsContainer}>
            <PrayerCard title="Fajr" time={prayerTimes.Fajr} prayer="Fajr" />
            <PrayerCard title="Dhuhr" time={prayerTimes.Dhuhr} prayer="Dhuhr" />
            <PrayerCard title="Asr" time={prayerTimes.Asr} prayer="Asr" />
            <PrayerCard title="Maghrib" time={prayerTimes.Maghrib} prayer="Maghrib" />
            <PrayerCard title="Isha" time={prayerTimes.Isha} prayer="Isha" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#004d00',
  },
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006400',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  prayerCardText: {
    fontSize: 16,
    color: '#ffffff',
  },
  prayerCardsContainer: {
    marginTop: 16,
    flexDirection: 'column',
  },
});

export default PrayerTimesApp;
