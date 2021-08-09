import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors'
import OpenDrawerIcon from './OpenDrawerIcon';

export default function NavBar() {

    const allBetsArr = useSelector(state => state.bets.bets)

    let totalAmount = 0
    allBetsArr.forEach(bet => {
        if (bet.complete && bet.wonBet) {
            totalAmount += bet.amount
        } else if (bet.complete && !bet.wonBet) {
            totalAmount -= bet.amount
        }
    })

    return (
        <View style={styles.navContainer}>
            <OpenDrawerIcon />
            <Text style={styles.totalText}>{totalAmount < 0 ? '-' : ''}${parseFloat(Math.abs(totalAmount)).toFixed(2)}</Text>
            <StatusBar />
        </View>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 130,
        backgroundColor: Colors.primaryColor,
        paddingTop: 20

    },
    menuIconContainer: {
        position: 'absolute',
        right: 5,
        top: 50,
        width: 50,
        height: 40,
    },
    menuIcon: {
        alignSelf: 'center'
    },
    totalText: {
        fontSize: 40,
        color: 'white',
        paddingTop: 20
    },
    statusBar: {
        color: 'red'
    }

});