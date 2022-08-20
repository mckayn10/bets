import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import Colors from '../constants/colors'
import BetCard from './BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import {fetchBets, fetchFeedBets} from '../store/actions/bets';
import HeaderText from './HeaderText'
import colors from '../constants/colors'

function BetList(props) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    useEffect(() => {
        setIsRefreshing(false)
    }, [])

    const dispatch = useDispatch()

    const loadBets = () => {
        setIsRefreshing(true)
        try {
            if(props.feed){
                dispatch(fetchFeedBets())
            }else {
                dispatch(fetchBets())
            }
        }
        catch (err) {
            console.error(err)
        }
        setIsRefreshing(false)
    }

    const endReached = () => {
        // props.onEndReached()
    }

    const renderCompletedBet = betData => {
        let pendingStyle = betData.item.is_verified && !betData.item.is_accepted ? { opacity: 1 } : { opacity: 1 }
        return (
            <View style={pendingStyle}>
                <BetCard
                    {...props}
                    bet={betData.item}
                    permissions={props.permissions}
                    personId={props.personId}
                />
            </View>
        );

    }

    return (
        <SafeAreaView style={styles.container}>
            {props.bets.length > 0
                ? <FlatList
                    onEndReached={() => endReached()}
                    onEndReachedThreshold={.7}
                    onRefresh={loadBets}
                    refreshing={isRefreshing}
                    data={props.bets}
                    renderItem={renderCompletedBet}
                    keyExtractor={(bet, index) => index.toString()}
                />
                : <View style={styles.emptyContainer}>
                    <FlatList
                        onRefresh={loadBets}
                        refreshing={isRefreshing}
                        data={props.bets}
                        renderItem={renderCompletedBet}
                        keyExtractor={(bet, index) => index.toString()}
                        style={{ backgroundColor: 'transparent', zIndex: 1 }}
                    />
                    <View style={{ position: 'absolute', left: 0, right: 0, zIndex: 0, top: 60 }}>
                        <HeaderText style={styles.emptyText}>Nothing to display</HeaderText>
                        <HeaderText style={styles.emptyText}>Swipe down to refresh</HeaderText>
                        <MaterialIcons style={styles.icon} name="request-page" size={120} color={Colors.grayLight} />
                    </View>
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
        justifyContent: 'center',
        backgroundColor: Colors.backgroundColor,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        padding: 5,
        color: colors.grayDark
    },
    icon: {
        alignSelf: 'center',
        marginTop: 10
    }
})

export default BetList;