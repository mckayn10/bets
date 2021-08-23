import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors'
import HeaderText from './HeaderText';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';
import OpenDrawerIcon from './OpenDrawerIcon';
import NotificationsIcon from './NotificationsIcon'

export default function NavBar({props}) {

    const dispatch = useDispatch()

    const allBetsArr = useSelector(state => state.bets.bets)
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let totalAmount = 0
    allBetsArr.forEach(bet => {
        const {is_accepted, is_complete, is_verified} = bet
        let completedCriteria = is_complete && !is_verified || is_complete && is_accepted
        if (completedCriteria && bet.won_bet) {
            totalAmount += bet.amount
        } else if (completedCriteria && !bet.won_bet) {
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 150,
        backgroundColor: Colors.primaryColor,
        paddingTop: 60

    },
    totalText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
    },

});