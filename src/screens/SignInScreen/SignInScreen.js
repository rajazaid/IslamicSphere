import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, username, password).then(() => {
        if (auth.currentUser.emailVerified) {
          navigation.navigate('Home');
        } else {
          alert("You have to verify your email first...check your mail");
          sendEmailVerification(auth.currentUser);
        }
      });
    } catch (error) {
      console.log(error);
      alert("Sign in failed due to" + error.message);
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />

      <CustomInput
        placeholder="Email"
        value={username}
        setValue={setUsername}
        iconName="mail-outline" // Ionicons icon name for email
      />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry
        iconName="lock-closed-outline" // Ionicons icon name for lock
      />

      <CustomButton text="Sign In" onPress={onSignInPressed} />

      <CustomButton
        text="Forgot password?"
        onPress={onForgotPasswordPressed}
        type="TERTIARY"
      />

      <SocialSignInButtons />

      <CustomButton
        text="Don't have an account? Create one"
        onPress={onSignUpPress}
        type="TERTIARY"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    height: 1000,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
