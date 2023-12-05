import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const PrayerTimesApp = () => {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);

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

  const fetchPrayerTimes = async (coords) => {
    try {
      const response = await axios.get('http://api.aladhan.com/v1/timings', {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          method: 5, // Adjust the calculation method as needed
        },
      });

      const prayerTimes = response.data.data.timings;
      setPrayerTimes(prayerTimes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {location && (
        <View>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      )}

      {prayerTimes && (
        <View>
          <Text>Fajr: {prayerTimes.Fajr}</Text>
          <Text>Dhuhr: {prayerTimes.Dhuhr}</Text>
          <Text>Asr: {prayerTimes.Asr}</Text>
          <Text>Maghrib: {prayerTimes.Maghrib}</Text>
          <Text>Isha: {prayerTimes.Isha}</Text>
        </View>
      )}
    </View>
  );
};

export default PrayerTimesApp;


