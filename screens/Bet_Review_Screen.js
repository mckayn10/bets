import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import colors from '../constants/colors'
import { completedCriteria } from '../constants/utils'
import db from '../firebase/firestore'
import { deleteBet, updateBet } from '../store/actions/bets'
import { useDispatch, useSelector } from 'react-redux'
import { deleteNotification, sendBetResponse } from '../store/actions/notifications'

export default function Bet_Review_Screen(props) {

    const data = props.route.params.data
    const notiId = props.route.params.data.notiId

    const dispatch = useDispatch()

    const userId = useSelector(state => state.auth.userId)
    const userInfo = useSelector(state => state.auth.userInfo)

    const [bet, setBet] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    let status = completedCriteria(bet)
    let infoToDisplayBasedOnUser = bet ? {
        otherBettorName: bet.creator_id === userId ? bet.other_bettor.firstName : bet.creator.firstName,
        otherId: bet.creator_id === userId ? bet.other_id : bet.creator_id,
        creatorName: bet.creator_id === userId ? 'You' : bet.creator.firstName + ' ' + bet.creator.lastName,
        displayOtherName: bet.creator_id === userId ? bet.other_bettor.firstName + ' ' + bet.other_bettor.lastName : bet.creator.firstName + ' ' + bet.creator.lastName,
        didWin: bet.won_bet === userId ? true : false,
        nameOfWinner: bet.won_bet === userId ? 'You' : (bet.creator_id === userId ? bet.other_bettor.firstName + ' ' + bet.other_bettor.lastName : bet.creator.firstName + ' ' + bet.creator.lastName)
    }
        : null

    useEffect(() => {
        setBet(data)
        setIsLoading(false)
    }, [])

    const handleAccepted = () => {

        let statusChanged = completedCriteria(bet)
        bet.is_accepted = true
        let notificationType = 'betAccept'

        try {
            dispatch(updateBet(bet, statusChanged))
        } catch (err) {
            console.error(err)
        }
        sendBetResponse(bet, notificationType)
        deleteNotification(notiId)
        props.navigation.navigate('Notifications')

    }

    const handleDeclined = () => {
        let notificationType = 'betDecline'
        sendBetResponse(bet, notificationType)
        deleteNotification(notiId)
        try {
            dispatch(deleteBet(bet.id))
        } catch (err) {
            console.error(err)
        }
        // sendBetResponse(bet, notificationType)
        // deleteNotification(notiId)
        props.navigation.navigate('Notifications')

    }

    return (
        !isLoading
            ? <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.text}>Other Bettor:</Text>
                    <Text style={styles.text}>{infoToDisplayBasedOnUser.displayOtherName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Amount:</Text>
                    <Text style={styles.text}>${parseFloat(bet.amount).toFixed(2)}</Text>
                </View>
                <View style={[styles.row, { flexDirection: 'column' }]}>
                    <Text style={[styles.text, { marginBottom: 10 }]}>Description:</Text>
                    <Text style={styles.text}>{bet.description}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Status:</Text>
                    <Text style={styles.text}>{status ? 'Complete' : 'Pending'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Winner of Bet:</Text>
                    <Text style={styles.text}>{bet.won_bet == userId ? 'You' : (bet.won_bet == infoToDisplayBasedOnUser.otherId ? infoToDisplayBasedOnUser.otherBettorName : 'Undecided') }</Text>
                </View>

                {bet.is_accepted
                    ? null
                    : <View style={styles.btnRow}>
                        <Button
                            title='Accept'
                            type="outline"
                            buttonStyle={[styles.btn, styles.btnAccept]}
                            titleStyle={{ color: 'white' }}
                            onPress={() => handleAccepted()}
                        />
                        <Button
                            title='Decline'
                            type="outline"
                            buttonStyle={[styles.btn, styles.btnDecline]}
                            titleStyle={{ color: 'white' }}
                            onPress={() => handleDeclined()}

                        />
                    </View>
                }
            </View>
            : <View>
                <Text>Loading...</Text>
            </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        padding: 15,
        width: '100%'
    },
    row: {
        margin: 5,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight
    },
    text: {
        fontSize: 18
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 15
    },
    btn: {
        fontSize: 50,
        margin: 10,
        width: 100
    },
    btnAccept: {
        backgroundColor: colors.primaryColor,
        borderColor: colors.primaryColor
    },
    btnDecline: {
        backgroundColor: colors.red,
        borderColor: colors.red
    }
})