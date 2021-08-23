import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native'
import { useSelector,useDispatch } from 'react-redux'
import Colors from '../constants/colors'
import BetCard from '../components/BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBets } from '../store/actions/bets';



function Incomplete_Bets_Screen(props) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const betsArr = props.bets

    useEffect(() => {
        setIsRefreshing(false)
    }, [])

    const dispatch = useDispatch()
    
    const loadBets = () => {
        setIsRefreshing(true)
        try {
            dispatch(fetchBets())
        } catch(err){
            console.error(err)
        }
        setIsRefreshing(false)
    }

    let count = 0
    betsArr.forEach(bet => {
        const {is_accepted, is_complete, is_verified} = bet
        let isPending = !is_complete && !is_verified || is_verified && !is_accepted || is_accepted && !is_complete
        if (isPending) {
            count++
        }
    })

    const renderIncompleteBet = betData => {
        const {is_accepted, is_complete, is_verified} = betData.item
        let isPending = !is_complete && !is_verified || is_verified && !is_accepted || is_accepted && !is_complete
        
        if (isPending) {
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
                    onRefresh={loadBets}
                    refreshing={isRefreshing}
                    data={betsArr}
                    renderItem={renderIncompleteBet}
                    keyExtractor={(bet, index) => index.toString()}
                />
                :
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pending bets to display</Text>
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

export default Incomplete_Bets_Screen;