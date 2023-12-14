import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({ value, setValue, placeholder, iconName, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={20} color="#808080" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomInput;
