import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native'
import { useSelector,useDispatch } from 'react-redux'
import Colors from '../constants/colors'
import BetCard from '../components/BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBets } from '../store/actions/bets';



function Shared_Bets_Screen(props) {
    const betsArr = props.bets

    let userId = useSelector(state => state.auth.userId)

    const checkIfShared = (bet) => {
        let meetsCriteria = bet.other_id === props.personId && bet.creator_id === userId || bet.other_id === userId && bet.creator_id === props.personId
        return meetsCriteria
    }

    let count = 0
    betsArr.forEach(bet => {
        let isShared = checkIfShared(bet)
        if (isShared) {
            count++
        }
    })


    const renderSharedBets = betData => {
        let isShared = checkIfShared(betData.item)
        
        if (isShared) {
            return (
                <BetCard
                    bet={betData.item}
                    permissions={true}
                />
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {count > 0
                ? <FlatList
                    data={betsArr}
                    renderItem={renderSharedBets}
                    keyExtractor={(bet, index) => index.toString()}
                />
                :
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No shared bets to display</Text>
                    <MaterialIcons style={styles.icon} name="request-page" size={120} color={Colors.grayDark} />
                </View>
            }
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.backgroundColor
    },
    emptyContainer: {
        flex: 1,
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: Colors.backgroundColor
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        padding: 5,
        opacity: .3
    },
    icon: {
        alignSelf: 'center'
    }
})

export default Shared_Bets_Screen;