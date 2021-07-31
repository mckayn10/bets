import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/colors'

export default function NavBar() {
  return (
    <View style={styles.navContainer}>
      <Text style={styles.totalText}>$0.00</Text>
      <StatusBar style="auto" />
    </View> 
  );
}

const styles = StyleSheet.create({
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 140,
    paddingTop: 30,
    backgroundColor: Colors.primaryColor,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  totalText: {
    fontSize: 30,
    color: 'white'
  }
});