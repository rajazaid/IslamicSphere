import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Card, Button } from 'react-native-elements';

const NearbyMosquesMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyMosques, setNearbyMosques] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        fetchNearbyMosques(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (nearbyMosques.length > 0) {
      // Calculate the region that includes all markers
      const coordinates = nearbyMosques.map((mosque) => ({
        latitude: mosque.geometry.location.lat,
        longitude: mosque.geometry.location.lng,
      }));
      const region = calculateRegion(coordinates);
      setMapRegion(region);
    }
  }, [nearbyMosques]);

  const fetchNearbyMosques = async (latitude = 33, longitude = 73) => {
    try {
      const apiKey = 'AIzaSyCaeQd6hqcmyhFuoO34tE_jBa8vX-Fwk7o';
      const radius = 500; // in meters
      const type = 'mosque';

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        setNearbyMosques(data.results);
      } else {
        console.error('Google Places API Error:', data);
      }
    } catch (error) {
      console.error('Error fetching nearby mosques', error);
    }
  };

  const calculateRegion = (coordinates) => {
    let maxLat = -90;
    let minLat = 90;
    let maxLng = -180;
    let minLng = 180;

    coordinates.forEach((coordinate) => {
      maxLat = Math.max(maxLat, coordinate.latitude);
      minLat = Math.min(minLat, coordinate.latitude);
      maxLng = Math.max(maxLng, coordinate.longitude);
      minLng = Math.min(minLng, coordinate.longitude);
    });

    const midLat = (maxLat + minLat) / 2;
    const midLng = (maxLng + minLng) / 2;
    const deltaLat = maxLat - minLat + 0.01;
    const deltaLng = maxLng - minLng + 0.01;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLng,
    };
  };

  const renderMosqueCard = (mosque, index) => {
    return (
      <Card key={index} containerStyle={styles.cardContainer}>
        <Card.Title>{mosque.name}</Card.Title>
        <Card.Divider />
        <Text>{mosque.vicinity}</Text>
        <Button
          icon={{ name: 'directions' }}
          onPress={() => handleGetDirections(mosque)}
          buttonStyle={styles.directionsButton}
          title="Get Directions"
        />
      </Card>
    );
  };

  const handleGetDirections = (mosque) => {
    const destination = `${mosque.geometry.location.lat},${mosque.geometry.location.lng}`;
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1, height: '50%' }} region={mapRegion}>
        {/* User Marker */}
        {userLocation && (
          <Marker
         
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="green"
          />
        )}

        {/* Mosques Markers */}
        {nearbyMosques.map((mosque, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: mosque.geometry.location.lat,
              longitude: mosque.geometry.location.lng,
            }}
            title={mosque.name}
            description={mosque.vicinity}
          />
        ))}

        {/* Direction */}
        {userLocation && nearbyMosques.length > 0 && (
          <MapViewDirections
            origin={userLocation}
            destination={{
              latitude: nearbyMosques[0].geometry.location.lat,
              longitude: nearbyMosques[0].geometry.location.lng,
            }}
            apikey="AIzaSyCaeQd6hqcmyhFuoO34tE_jBa8vX-Fwk7o"
            strokeWidth={3}
            strokeColor="hotpink"
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min`);
            }}
          />
        )}
      </MapView>

      {/* Display nearby mosques in cards */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.mosquesList}>
          <Text>Nearby Mosques:</Text>
          {nearbyMosques.map((mosque, index) => (
            renderMosqueCard(mosque, index)
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: '60%',
  },
  mosquesList: {
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  cardContainer: {
    marginBottom: 10,
  },
  directionsButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default NearbyMosquesMap;
