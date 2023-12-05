// src/components/AudioPlayer.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer = ({ audioFile }) => {
  const [sound, setSound] = useState();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      audioFile,
      { shouldPlay: true }
    );
    setSound(sound);
  };

  const pauseSound = () => {
    if (sound) {
      sound.pauseAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playSound}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pauseSound}>
        <Text style={styles.buttonText}>Pause</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 36,
    color: 'black',
    marginHorizontal: 100,
    marginVertical: 0,
  },
};

export default AudioPlayer;
