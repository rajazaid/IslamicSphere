import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, Text, Alert } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const { height } = useWindowDimensions();

  const onRegisterPressed = async () => {
    if(password===passwordRepeat){
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // After successfully creating the user, send email verification
      sendEmailVerification(userCredential.user);

      // Display a message to inform the user to check their email for verification
      alert(
        'Email Verification',
        'A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your email.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      navigation.navigate('SignIn');
    } catch (error) {
      console.log(error);
      alert('Registration failed due to' + error.message);
    }
  }
  else{
      alert("Password did not match")
  }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  return (
    <View style={styles.root}>

      <Text style={styles.title}>Create an account</Text>

      <CustomInput placeholder="Username" value={username} setValue={setUsername} iconName="person" />
      <CustomInput placeholder="Email" value={email} setValue={setEmail} iconName="mail-outline" />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry
        iconName="lock-closed-outline"
      />
      <CustomInput
        placeholder="Repeat Password"
        value={passwordRepeat}
        setValue={setPasswordRepeat}
        secureTextEntry
        iconName="lock-closed-outline"
      />

      <CustomButton text="Register" onPress={onRegisterPressed} />

      <Text style={styles.text}>
        By registering, you confirm that you accept our{' '}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>
          Terms of Use
        </Text>{' '}
        and{' '}
        <Text style={styles.link} onPress={onPrivacyPressed}>
          Privacy Policy
        </Text>
      </Text>

      <SocialSignInButtons />

      <CustomButton text="Have an account? Sign in" onPress={onSignInPress} type="TERTIARY" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    height: 1000,
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
    marginTop:50
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default SignUpScreen;
