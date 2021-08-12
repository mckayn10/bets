import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors'
import OpenDrawerIcon from './OpenDrawerIcon';
import HeaderText from './HeaderText';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';

export default function NavBar({props}) {
    const dispatch = useDispatch()

    const allBetsArr = useSelector(state => state.bets.bets)
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let totalAmount = 0
    allBetsArr.forEach(bet => {
        if (bet.complete && bet.wonBet) {
            totalAmount += bet.amount
        } else if (bet.complete && !bet.wonBet) {
            totalAmount -= bet.amount
        }
    })
    let num = parseFloat(Math.abs(totalAmount)).toFixed(2)
    let formattedAmount = numberWithCommas(num)
    const logoutUser = () => {
        dispatch(logout())
        dispatch(removeData())
        props.navigation.navigate('Auth')
    }

    return (
        <View style={styles.navContainer}>
            {/* <OpenDrawerIcon props={props}/> */}
            <HeaderText style={{ position: 'absolute', right: 10, top: 50, color: 'white' }} onPress={() => logoutUser()}>Logout</HeaderText>
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