import React from 'react';
import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import SignInScreen from '../../screens/SignInScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import ConfirmEmailScreen from '../../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../../screens/NewPasswordScreen';
import HomeScreen from '../../screens/HomeScreen';
import QiblaDirectionApp from '../../screens/QiblaScreen';
import calendar from '../../screens/Calender';
import AyahSerch from '../../screens/AyahSearch';
import HadithSearch from '../../screens/Calender';
import QuranScreen from '../../screens/QuranScreen';
import BookmarkScreen from '../../screens/bookmarkscreen';
import SurahListScreen from '../../screens/SurahList';
import AzkarScreen from '../../screens/AzkarScreen';
import NamesOfAllahScreen from '../../screens/NamesOfAllahScreen';
import NamesOfMuhammadScreen from '../../screens/NamesOfMuhammadScreen';
import books from '../../screens/HadeesSearch/books';
import bookscreen from '../../screens/HadeesSearch/HadesBooksScreen/bookscreen';
import HadithBookmarkScreen from '../../screens/HadeesSearch/HadesBooksScreen/bookmark';
import prayertracking from '../../screens/PrayerTracking';
import HadithBooksScreen from '../../screens/HadeesSearch/books';
import SurahDetailScreen from '../../screens/SurahDetail';
import namaztiming from '../../screens/namaztiming';
import mosque from '../../screens/mosque';


// Additional screen for the Home stack

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for Unauthenticated Screens


// Stack for Authenticated Screens
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'Sign in',
          headerStyle: {
            backgroundColor: '#2f4f4f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
     {/* Additional screen */}
      {/* Add more additional screens for the Home stack if needed */}
    </Stack.Navigator>
  );
};

const QuranStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='AyahSearch'>
      <Stack.Screen name="SurahList" component={SurahListScreen} />
      <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
      <Stack.Screen name="Quran" component={QuranScreen} />
      <Stack.Screen name="AyahSearch" component={AyahSerch} />
      {/* Add additional screens for the Quran stack if needed */}
    </Stack.Navigator>
  );
};

const SurahStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen name="Al hadees" component={HadithBooksScreen} />
      <Stack.Screen name="HadeesBook" component={bookscreen} />
      
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Calendar" component={calendar} />
      {/* Add additional screens for the More stack if needed */}
    </Stack.Navigator>
  );
};
const PrayerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen name="Prayer" component={namaztiming} />
      <Stack.Screen name="Mosque" component={mosque} />
      
      <Stack.Screen name="More" component={QiblaDirectionApp} />
      {/* Add additional screens for the More stack if needed */}
    </Stack.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quran') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Al hadees') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Prayer') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown:false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#2f4f4f', // Dark green background color for the bottom tab navigator
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Quran" component={QuranStack} />
      <Tab.Screen name="Al hadees" component={SurahStack} />
      <Tab.Screen name="Prayer" component={PrayerStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
