import React from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import Colors from '../constants/colors'
import HeaderText from './HeaderText';
import { useDispatch, useSelector } from 'react-redux';
import TestComponent from "./TestComponent";
import {Feather, FontAwesome, Ionicons} from "@expo/vector-icons";
import {completedCriteria, getUserTotalAmount} from "../constants/utils";

export default function NavBar({props}) {

    const dispatch = useDispatch()
    const userId = useSelector(state => state.auth.userId)


    const allBetsArr = useSelector(state => state.bets.bets)
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let totalAmount = getUserTotalAmount(allBetsArr, userId)
    // allBetsArr.forEach(bet => {
    //     if (completedCriteria(bet) && bet.won_bet == userId) {
    //         if(bet.potentialWinnings && bet.won_bet == bet.creator_id){
    //             totalAmount += bet.potentialWinnings
    //         } else {
    //             totalAmount += bet.amount
    //         }
    //     } else if (completedCriteria(bet) && bet.won_bet != userId) {
    //         if(bet.potentialWinnings && bet.won_bet == bet.creator_id){
    //             totalAmount -= bet.potentialWinnings
    //         } else {
    //             totalAmount -= bet.amount
    //         }
    //     }
    // })
    let num = parseFloat(Math.abs(totalAmount)).toFixed(2)
    let formattedAmount = numberWithCommas(num)

    return (
        <SafeAreaView style={styles.navContainer}>
            <Pressable style={styles.searchIcon} onPress={() => props.navigation.navigate('User')}>
                <Ionicons  name='search-outline' size={28} color={'white'} />
            </Pressable>
            <HeaderText style={styles.totalText}>{totalAmount < 0 ? '-' : ''}${formattedAmount}</HeaderText>
            {/*<TestComponent />*/}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: 110,
        backgroundColor: Colors.primaryColor,
    },
    totalText: {
        fontSize: 34,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 17
    },
    searchIcon: {
        position: "absolute",
        right: 15,
        top: 50
    }

});