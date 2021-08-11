import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors'
import OpenDrawerIcon from './OpenDrawerIcon';

export default function NavBar(props) {
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
            <OpenDrawerIcon props={props}/>
            <Text style={styles.totalText}>{totalAmount < 0 ? '-' : ''}${parseFloat(Math.abs(totalAmount)).toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 140,
        backgroundColor: Colors.primaryColor,
        paddingTop: 20

    },
    totalText: {
        fontSize: 40,
        color: 'white',
    },

});