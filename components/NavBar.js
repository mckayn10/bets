import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Colors from '../constants/colors'
import HeaderText from './HeaderText';
import { useDispatch, useSelector } from 'react-redux';

export default function NavBar({props}) {

    const dispatch = useDispatch()
    const userId = useSelector(state => state.auth.userId)


    const allBetsArr = useSelector(state => state.bets.bets)
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let totalAmount = 0
    allBetsArr.forEach(bet => {
        const {is_accepted, is_complete, is_verified} = bet
        let completedCriteria = is_complete && !is_verified || is_complete && is_accepted
        if (completedCriteria && bet.won_bet == userId) {
            totalAmount += bet.amount
        } else if (completedCriteria && bet.won_bet != userId) {
            totalAmount -= bet.amount
        }
    })
    let num = parseFloat(Math.abs(totalAmount)).toFixed(2)
    let formattedAmount = numberWithCommas(num)

    return (
        <SafeAreaView style={styles.navContainer}>
            <HeaderText style={styles.totalText}>{totalAmount < 0 ? '-' : ''}${formattedAmount}</HeaderText>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: 150,
        backgroundColor: Colors.primaryColor,
    },
    totalText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 25
    },

});