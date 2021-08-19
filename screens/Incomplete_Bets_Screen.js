import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native'
import { useSelector,useDispatch } from 'react-redux'
import Colors from '../constants/colors'
import BetCard from '../components/BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBets } from '../store/actions/bets';



function Incomplete_Bets_Screen(props) {
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setIsRefreshing(false)
    }, [])

    const dispatch = useDispatch()

    const loadBets = useCallback(async () => {
        setIsRefreshing(true)
        try {
            await dispatch(fetchBets())
        } catch(err){
            console.error(err)
        }
        setIsRefreshing(false)
    }, [dispatch])

    const betsArr = useSelector(state => state.bets.bets)

    let count = 0
    betsArr.forEach(bet => {
        if (!bet.is_complete) {
            count++
        }
    })

    const renderIncompleteBet = betData => {
        if (!betData.item.is_complete) {
            return (
                <BetCard
                    title={betData.item.description}
                    bet={betData.item}
                />
            );
        } else {
            return
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {count > 0
                ? <FlatList
                    onRefresh={loadBets}
                    refreshing={isRefreshing}
                    data={betsArr}
                    renderItem={renderIncompleteBet}
                    keyExtractor={(bet, index) => index.toString()}
                />
                :
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pending bets to display</Text>
                    <MaterialIcons style={styles.icon} name="request-page" size={120} color={Colors.accentColor} />
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

export default Incomplete_Bets_Screen;