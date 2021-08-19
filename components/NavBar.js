import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors'
import HeaderText from './HeaderText';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';
import OpenDrawerIcon from './OpenDrawerIcon';

export default function NavBar({props}) {

    const dispatch = useDispatch()

    const allBetsArr = useSelector(state => state.bets.bets)
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let totalAmount = 0
    allBetsArr.forEach(bet => {
        if (bet.is_complete && bet.won_bet) {
            totalAmount += bet.amount
        } else if (bet.is_complete && !bet.won_bet) {
            totalAmount -= bet.amount
        }
    })
    let num = parseFloat(Math.abs(totalAmount)).toFixed(2)
    let formattedAmount = numberWithCommas(num)
    const logoutUser = () => {
        dispatch(logout())
        dispatch(removeData())
    }

    return (
        <View style={styles.navContainer}>
            <OpenDrawerIcon {...props}/>
            <HeaderText style={styles.totalText}>{totalAmount < 0 ? '-' : ''}${formattedAmount}</HeaderText>
        </View>
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
        fontWeight: 'bold'
    },

});