import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const NearbyMosquesApp = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyMosques, setNearbyMosques] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        fetchNearbyMosques(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting user location', error);
        setError('Error getting user location');
      }
    };

    const fetchNearbyMosques = async (latitude, longitude) => {
      try {
        const apiKey = '';
        const radius = 5000; // in meters
        const type = 'mosque';

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`
        );

        if (response.data.status === 'OK') {
          setNearbyMosques(response.data.results);
        } else {
          console.error('Google Places API Error:', response.data);
          setError('Error fetching nearby mosques');
        }
      } catch (error) {
        console.error('Error fetching nearby mosques', error);
        setError('Error fetching nearby mosques');
      }
    };

    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation && (
        <View style={styles.locationInfo}>
          <Text>User Location:</Text>
          <Text>Latitude: {userLocation.latitude}</Text>
          <Text>Longitude: {userLocation.longitude}</Text>
        </View>
      )}

      {nearbyMosques.length > 0 && (
        <View style={styles.mosquesList}>
          <Text>Nearby Mosques:</Text>
          {nearbyMosques.map((mosque, index) => (
            <Text key={index}>{mosque.name}</Text>
          ))}
        </View>
      )}

      {error && (
        <View style={styles.errorInfo}>
          <Text>Error: {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    marginBottom: 20,
  },
  mosquesList: {
    marginBottom: 20,
  },
  errorInfo: {
    marginTop: 20,
  },
});

export default NearbyMosquesApp;
