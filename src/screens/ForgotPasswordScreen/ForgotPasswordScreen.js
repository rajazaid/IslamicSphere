import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const auth = getAuth();
const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');

  const navigation = useNavigation();

  const onSendPressed = () => {
    const auth = getAuth();
sendPasswordResetEmail(auth, username)
  .then(() => {
    alert("Please check your email")
  })
  .catch((error) => {
    alert("Email could not be sent due to unknown errors")
  });
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput
          placeholder="Email"
          value={username}
          setValue={setUsername}
        />

        <CustomButton text="Send" onPress={onSendPressed} />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex:1,
    justifyContent:'center',
    backgroundColor: '#2f4f4f',
    alignItems: 'center',
    padding: 20,
    height:700,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    margin: 20,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ForgotPasswordScreen;
