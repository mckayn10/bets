import React, { useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View, } from 'react-native'
import Colors from '../constants/colors';
import { useSelector } from 'react-redux'
import { completedCriteria, pendingCriteria } from '../constants/utils';
import HeaderText from '../components/HeaderText';
import MyLineChart from '../components/LineChart';
import colors from '../constants/colors';


function Stats_Screen(props) {
    let bets = props.route.params ? props.route.params.bets : useSelector(state => state.bets.bets)
    const userId = useSelector(state => state.auth.userId)

    const totalBets = bets.length

    
    const getChartData = () => {
        let betsArr = bets
        let dataArr = [0]
        let totalAmount = 0
        betsArr.sort(function (x, y) {
            return x.date_complete - y.date_complete;
          })
        betsArr.forEach(bet => {
            if (completedCriteria(bet) && bet.won_bet == userId) {
                totalAmount += bet.amount
                dataArr.push(totalAmount)
            } else if (completedCriteria(bet) && bet.won_bet != userId) {
                totalAmount -= bet.amount
                dataArr.push(totalAmount)
            }
        })
        return dataArr

    }

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
            if (completedCriteria(bet) && bet.won_bet == userId) {
                amountWon += bet.amount
            } else if (completedCriteria(bet) && bet.won_bet != userId) {
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
            if (completedCriteria(bet) && bet.won_bet == userId) {
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
            if (completedCriteria(bet) && bet.won_bet != userId) {
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

    let totalAmountTitle = props.route.params ? `You've fleeced ` + props.route.params.person.firstName + ' for:' : 'Net Profit/Loss'


    return (
        <ScrollView>
            <HeaderText style={styles.pageTitle}>{props.route.params ? 'You vs ' + props.route.params.person.firstName : 'My Stats'}</HeaderText>
            <MyLineChart data={getChartData()}/>

            <View style={styles.container}>
                <View style={[styles.statContainer, { width: '95%' }]}>
                    <HeaderText style={styles.statTitle}>Your total Gains/Losses</HeaderText>
                    <Text style={[styles.statNumber, { fontSize: 40, color: totalAmountCompleted() < 0 ? colors.red : colors.primaryColor }]}>{totalAmountCompleted() < 0 ? '-' : ''}${parseFloat(Math.abs(totalAmountCompleted())).toFixed(2)}</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Win Percentage</HeaderText>
                    <Text style={styles.statNumber}>{winPercentage}%</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Lose Percentage</HeaderText>
                    <Text style={styles.statNumber}>{lostPercentage}%</Text>
                </View>
                <View style={[styles.statContainer, { width: '95%' }]}>
                    <HeaderText style={styles.statTitle}>Avg Winnings Per Bet</HeaderText>
                    <Text style={[styles.statNumber, { fontSize: 40, color: totalAmountCompleted() < 0 ? colors.red : colors.primaryColor  }]}>{totalAmountCompleted() < 0 ? '-' : ''}${perBetAvg}</Text>
                </View>
                <View style={[styles.statContainer, styles.thirdColumn]}>
                    <HeaderText style={styles.statTitle}>Complete</HeaderText>
                    <Text style={styles.statNumber}>{completedBetsCount()}</Text>
                </View>
                <View style={[styles.statContainer, styles.thirdColumn]}>
                    <HeaderText style={styles.statTitle}>Won</HeaderText>
                    <Text style={styles.statNumber}>{wonBetsCount()}</Text>
                </View>
                <View style={[styles.statContainer, styles.thirdColumn]}>
                    <HeaderText style={styles.statTitle}>Lost</HeaderText>
                    <Text style={styles.statNumber}>{lostBetsCount()}</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Total</HeaderText>
                    <Text style={styles.statNumber}>{totalBets}</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Pending</HeaderText>
                    <Text style={styles.statNumber}>{pendingBetsCount()}</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Verified</HeaderText>
                    <Text style={styles.statNumber}>{verifiedBetsCount()}</Text>
                </View>
                <View style={[styles.statContainer]}>
                    <HeaderText style={styles.statTitle}>Unverified</HeaderText>
                    <Text style={styles.statNumber}>{totalBets - verifiedBetsCount()}</Text>
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
        padding: 5,
        backgroundColor: colors.backgroundColor
    },
    statContainer: {
        height: 150,
        width: '46%',
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
        color: colors.primaryColor,
        fontWeight: 'bold'
    },
    statTitle: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 16
    },
    pageTitle: {
        fontSize: 27,
        padding: 15,
        textAlign: 'center',
        color: 'gray',
        backgroundColor: colors.backgroundColor
    },
    thirdColumn: {
        width: '30%',
        height: 120
    }
})

export default Stats_Screen;