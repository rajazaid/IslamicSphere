import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

LocaleConfig.defaultLocale = 'en';

const IslamicEventsPage = () => {
  const [markedDates, setMarkedDates] = useState({
    '2023-02-24': { marked: true },
    // Add more marked dates as needed
  });

  // Add your Islamic events with corresponding dates and details to highlight on the calendar
  const [islamicEvents, setIslamicEvents] = useState([
    { date: '2023-03-01', name: '9 Muharram', details: 'Details for Event 1', reminder: false },
    { date: '2023-03-15', name: '10 Muharram', details: 'Details for Event 2', reminder: false },
    { date: '2023-11-26', name: 'Event 3', details: 'Details for Event 3', reminder: false },
    // Add more events as needed
  ]);

  // Update markedDates with Islamic events
  useEffect(() => {
    const updatedMarkedDates = { ...markedDates };
    islamicEvents.forEach((event) => {
      const isUpcoming = new Date(event.date) > new Date();
      updatedMarkedDates[event.date] = {
        marked: true,
        customStyles: {
          container: {
            backgroundColor: isUpcoming ? 'orange' : 'green',
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          },
        },
      };
    });
    setMarkedDates(updatedMarkedDates);
  }, [islamicEvents]);

  const handleDayPress = (day) => {
    const selectedDate = markedDates[day.dateString];
    if (selectedDate && selectedDate.marked) {
      const matchingEvent = islamicEvents.find((event) => event.date === day.dateString);
      if (matchingEvent) {
        Alert.alert('Event Details', matchingEvent.details, [
          {
            text: 'OK',
            onPress: () => {
              // Handle event details confirmation
            },
          },
        ]);
      }
    }
  };

  const toggleReminder = (index) => {
    const updatedEvents = [...islamicEvents];
    updatedEvents[index].reminder = !updatedEvents[index].reminder;
    setIslamicEvents(updatedEvents);
  };

  const scheduleReminder = async (event) => {
    const reminderDate = new Date(event.date);
    reminderDate.setMinutes(980); // Set the reminder time, for example, 9 AM

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: `Reminder: ${event.name}`,
      },
      trigger: {
        date: reminderDate,
      },
    });

    Alert.alert('Reminder Set', `You will be reminded of ${event.name} at 9 AM on ${event.date}`);
  };

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    return () => {
      // Clean up if needed
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Calendar</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => handleDayPress(day)}
          renderDay={(day, marking) => (
            <View>
              <Text style={[styles.dayText, marking?.marked && marking?.customStyles?.text]}>
                {day.day}
              </Text>
            </View>
          )}
          theme={{
            calendarBackground: '#333',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#555',
            selectedDayTextColor: '#fff',
            todayTextColor: '#00adf5',
            dayTextColor: '#fff',
            textDisabledColor: '#666',
            dotColor: '#fff',
            selectedDotColor: '#fff',
            arrowColor: '#fff',
            monthTextColor: '#fff',
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Islamic Events</Text>
        {islamicEvents.map((event, index) => (
          <TouchableOpacity key={event.date} onPress={() => handleDayPress({ dateString: event.date })}>
            <View style={styles.eventContainer}>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventName}>{event.name}</Text>
              </View>
              <View style={styles.reminderContainer}>
                <Text style={styles.reminderText}>Set Reminder</Text>
                <Switch
                  value={event.reminder}
                  onValueChange={() => {
                    toggleReminder(index);
                    if (!event.reminder) {
                      Alert.alert(
                        'Set Reminder',
                        'Do you want to set a reminder for this event?',
                        [
                          { text: 'No', style: 'cancel' },
                          { text: 'Yes', onPress: () => scheduleReminder(event) },
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#111', // Dark background color
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White text color
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222', // Darker background color
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventDate: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  reminderContainer: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  reminderText: {
    fontSize: 16,
    color: '#fff',
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default IslamicEventsPage;
