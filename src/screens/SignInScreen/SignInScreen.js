import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Logo from '../../../assets/images/download.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = async() => {
    console.log("hello")
    try{
    const response = await signInWithEmailAndPassword(auth,username,password).then(()=>{
      if(auth.currentUser.emailVerified){
        navigation.navigate('Home');
      }
      else{
        alert("You have to verify your email first...check ur mail")
        sendEmailVerification(auth.currentUser)
      }
    })
    
    }
    catch(error){
      console.log(error);
      alert("Sign in failed due to" + error.message)
    }
    finally{
      
    }
    // validate user
    
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />

        <CustomInput
          placeholder="Email"
          value={username}
          setValue={setUsername}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2f4f4f',
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;



