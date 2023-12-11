// HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {ImageBackground, View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import { Audio } from 'expo-av';


const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [islamicDate, setIslamicDate] = useState('');
  const [upcomingPrayer, setUpcomingPrayer] = useState('');
  const [countdownTimer, setCountdownTimer] = useState('');
  const [ayahOfTheDay, setAyahOfTheDay] = useState('');
  const [hadithOfTheDay, setHadithOfTheDay] = useState('');
  const [isReminderOn, setIsReminderOn] = useState(false);

  const [sound, setSound] = useState();

  const countdownRef = useRef(null);

  useEffect(() => {
    
    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    };

    const getIslamicDate = () => {
      const now = new Date();
      const islamicDate = new Intl.DateTimeFormat('en-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      return islamicDate;
    };

    const getUpcomingPrayer = async () => {
      try {
        const response = await axios.get('http://api.aladhan.com/v1/timings', {
          params: {
            latitude: 33.6343464,
            longitude: 73.123147,
            method: 1,
          },
        });

        const currentTime = new Date();
        const prayerTimes = response.data.data.timings;
        const prayerKeys = Object.keys(prayerTimes);

        for (const key of prayerKeys) {
          const prayerTime = new Date(`${response.data.data.date.gregorian.year}-${response.data.data.date.gregorian.month.number}-${response.data.data.date.gregorian.day}T${prayerTimes[key]}`);
          if (prayerTime > currentTime) {
            const timeDifference = prayerTime - currentTime;
            setUpcomingPrayer(`${key}: ${prayerTimes[key]}`);
            startCountdown(timeDifference);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    const fetchRandomAyah = async () => {
      try {
        const response = await axios.get('http://api.alquran.cloud/v1/search/Zakat/all/en');
        const rand = Math.floor(Math.random() * response.data.data.matches.length);
        setAyahOfTheDay(response.data.data.matches[rand].text);
      } catch (error) {
        console.error('Error fetching ayah:', error);
      }
    };

    const fetchRandomHadith = async () => {
      try {
        const hadithData = require('../../../assets/sahih_al_bukhari.json');
        const randomIndex = Math.floor(Math.random() * hadithData.length);
        setHadithOfTheDay(hadithData[randomIndex].books[0].hadiths[0].text);
      } catch (error) {
        console.error('Error fetching hadith:', error);
      }
    };
    fetchRandomAyah();
    fetchRandomHadith();

    const startCountdown = (milliseconds) => {
      countdownRef.current = setInterval(() => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));

        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        setCountdownTimer(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
        
        if (milliseconds <= 0) {
          clearInterval(countdownRef.current);
          setCountdownTimer('00:00:00');
          if (isReminderOn) {
            playSound();
          }
        }

        milliseconds -= 1000;
      }, 1000);
    };

    setCurrentTime(getCurrentTime());
    setIslamicDate(getIslamicDate());
    getUpcomingPrayer();


    const timeInterval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(countdownRef.current);
      sound && sound.unloadAsync();
    };
  }, [isReminderOn]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/azan3.mp3')
    );
    setSound(sound);

    await sound.playAsync();
  };

  const toggleReminder = () => {
    setIsReminderOn((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={require('../../../assets/images/bg.jpg')} style={styles.backgroundImage}>
        <View style={styles.bg}>
      {/* Current Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.largeText}>{currentTime}</Text>
      </View>

      {/* Islamic Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{islamicDate}</Text>
      </View>
      </View>
      </ImageBackground>

      {/* Upcoming Prayer Time */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Prayer Time</Text>
        <Text style={styles.countdownTimer}>{upcomingPrayer}</Text>
        <Text style={styles.countdownTimer}>{countdownTimer}</Text>
        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>Reminder</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isReminderOn ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleReminder}
            value={isReminderOn}
          />
        </View>
      </Card>

      {/* Ayah of the Day Card */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Ayah of the Day</Text>
        <Text style={styles.regularText}>{ayahOfTheDay}</Text>
      </Card>

      {/* Hadith of the Day Card */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Hadith of the Day</Text>
        <Text style={styles.regularText}>{hadithOfTheDay}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Dark green background color
  },
  timeContainer: {
    marginTop:45,
    padding: 5,
    alignItems: 'center',
  },
  dateContainer: {
    padding: 10,
    alignItems: 'center',
  },
  largeText: {
    fontSize: 36,
    fontStyle:'italic',
    color: 'white',
  },
  dateText: {
    fontSize: 24,
    fontStyle:'italic',
    color: '#fdf5e6',
  },
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  countdownTimer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  regularText: {
    fontSize: 16,
    color: 'black',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reminderText: {
    fontSize: 16,
    marginRight: 10,
  },
  backgroundImage:{
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
    justifyContent: 'center',
  },
  bg:{
    height:300,
  }
});

export default HomeScreen;
