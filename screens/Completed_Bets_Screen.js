import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Colors from '../constants/colors'
import BetCard from '../components/BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBets } from '../store/actions/bets';

function Completed_Bets_Screen(props) {
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setIsRefreshing(false)
    }, [])

    const dispatch = useDispatch()

    const loadBets = () => {
        setIsRefreshing(true)
        try {
            dispatch(fetchBets())
        }
        catch (err) {
            console.error(err)
        }
        setIsRefreshing(false)
    }

    let count = 0
    props.bets.forEach(bet => {
        if (bet.is_complete) {
            count++
        }
    })

    const renderCompletedBet = betData => {
        if (betData.item.is_complete) {
            return (
                <BetCard
                    bet={betData.item}
                    permissions={props.permissions}
                />
            );
        } else {
            return
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {count > 0
                ? <FlatList
                    onRefresh={loadBets}
                    refreshing={isRefreshing}
                    data={props.bets}
                    renderItem={renderCompletedBet}
                    keyExtractor={(bet, index) => index.toString()}
                />
                : <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{props.permissions ? 'No complete bets to display' : 'No bets to display'}</Text>
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

export default Completed_Bets_Screen;