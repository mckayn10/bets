import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, ScrollView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors';
import { useSelector } from 'react-redux'
import { completedCriteria, pendingCriteria } from '../constants/utils';
import HeaderText from '../components/HeaderText';


function Stats_Screen(props) {
    let bets = props.route.params ? props.route.params.bets : useSelector(state => state.bets.bets)
    const totalBets = bets.length

    useEffect(() => {
        return () => {
            bets = []
        }
    }, [bets])

    const completedBetsCount = () => {
        let count = 0
        bets.forEach(bet => {
            if (completedCriteria(bet)) {
                count++
            }
        })
        return count
    }

    const totalAmountCompleted = () => {
        let amountWon = 0
        let amountLost = 0
        bets.forEach(bet => {
            if (completedCriteria(bet) && bet.won_bet) {
                amountWon += bet.amount
            } else if(completedCriteria(bet) && !bet.won_bet) {
                amountLost += bet.amount
            }
        })
        return amountWon - amountLost
    }

    const pendingBetsCount = () => {
        let count = 0
        bets.forEach(bet => {
            if (pendingCriteria(bet)) {
                count++
            }
        })
        return count
    }

    const wonBetsCount = () => {
        let count = 0
        bets.forEach(bet => {
            if (completedCriteria(bet) && bet.won_bet) {
                count++
            }
        })
        return count
    }

    const verifiedBetsCount = () => {
        let count = 0
        bets.forEach(bet => {
            if (bet.is_verified) {
                count++
            }
        })
        return count
    }

    const lostBetsCount = () => {
        let count = 0
        bets.forEach(bet => {
            if (completedCriteria(bet) && !bet.won_bet) {
                count++
            }
        })
        return count
    }

    const averageWinningsPerBet = () => {
        let avgAmount = !totalAmountCompleted() / completedBetsCount() ? 0 : parseFloat((totalAmountCompleted() / completedBetsCount())).toFixed(2)
        return avgAmount
    }

    const winPercentage = !wonBetsCount() / completedBetsCount() ? 0 : parseFloat((wonBetsCount() / completedBetsCount()) * 100).toFixed(2)
    const lostPercentage = !lostBetsCount() / completedBetsCount() ? 0 : parseFloat((lostBetsCount() / completedBetsCount()) * 100).toFixed(2)
    const perBetAvg = !averageWinningsPerBet() ? 0 : parseFloat(Math.abs(averageWinningsPerBet())).toFixed(2)


    return (
        <ScrollView>
            <HeaderText style={styles.pageTitle}>{props.route.params ? props.route.params.person.firstName + "'s Stats" : 'My Stats'}</HeaderText>

            <View style={styles.container}>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Total Bets</HeaderText>
                    <Text style={styles.statNumber}>{totalBets}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Per Bet Avg</HeaderText>
                    <Text style={styles.statNumber}>{totalAmountCompleted() < 0 ? '-' : ''}${perBetAvg}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Completed</HeaderText>
                    <Text style={styles.statNumber}>{completedBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Pending</HeaderText>
                    <Text style={styles.statNumber}>{pendingBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Verified Bets</HeaderText>
                    <Text style={styles.statNumber}>{verifiedBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Unverified Bets</HeaderText>
                    <Text style={styles.statNumber}>{totalBets - verifiedBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Total Won</HeaderText>
                    <Text style={styles.statNumber}>{wonBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Total Lost</HeaderText>
                    <Text style={styles.statNumber}>{lostBetsCount()}</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Win Percentage</HeaderText>
                    <Text style={styles.statNumber}>{winPercentage}%</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Lose Percentage</HeaderText>
                    <Text style={styles.statNumber}>{lostPercentage}%</Text>
                </View>
                <View style={styles.statContainer}>
                    <HeaderText style={styles.statTitle}>Total Amount</HeaderText>
                    <Text style={styles.statNumber}>{totalAmountCompleted() < 0 ? '-' : ''}${parseFloat(Math.abs(totalAmountCompleted())).toFixed(2)}</Text>
                </View>
            </View>
        </ScrollView>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 5
    },
    statContainer: {
        height: 170,
        width: '45%',
        backgroundColor: 'white',
        margin: 5,
        padding: 10,
        alignItems: 'center',
        shadowColor: Colors.grayDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        borderRadius: 5

    },
    statNumber: {
        fontSize: 25,
        textAlign: 'center',
        padding: 15,
        marginTop: 15,
        color: 'gray',
        fontWeight: 'bold'
    },
    statTitle: {
        textAlign: 'center',
        color: Colors.primaryColor,
        fontSize: 16
    },
    pageTitle: {
        fontSize: 27,
        padding: 15,
        textAlign: 'center',
        color: 'gray'
    }
})

export default Stats_Screen;