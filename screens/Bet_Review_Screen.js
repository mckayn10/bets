import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import Colors from '../constants/colors'
import { completedCriteria } from '../constants/utils'
import { db } from '../firebase/firestore'
import { deleteBet, updateBet } from '../store/actions/bets'
import { useDispatch, useSelector } from 'react-redux'
import { deleteNotification, sendBetResponse, sendBetUpdateResponse, sendBetDeleteResponse } from '../store/actions/notifications'

export default function Bet_Review_Screen(props) {

    const data = props.route.params.betData
    const notiData = props.route.params.notiData
    const needsAction = props.route.params.notiData.pendingAction
    const notiId = props.route.params.notiData.notiId

    const person = props.route.params.notiData.from
    const user = props.route.params.notiData.to

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

    const handleAcceptOffer = () => {
        bet.is_accepted = true
        let statusChanged = completedCriteria(bet)
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
    const handleAccept = () => {
        if(notiData.type === 'betUpdate'){
            handleAcceptUpdate()
        } else if (notiData.type === 'betRequest'){
            handleAcceptOffer()
        } else if (notiData.type === 'betDelete'){
            handleAcceptDelete()
        }

    }

    const handleAcceptDelete = () => {
        let notificationType = 'betDeleteAccept'

        try {
            dispatch(deleteBet(bet.id))
        } catch (err) {
            console.error(err)
        }
        sendBetDeleteResponse(bet, user, person, notificationType)
        deleteNotification(notiId)
        props.navigation.navigate('Notifications')

    }

    const handleAcceptUpdate = () => {
        // TODO need to maybe compare this updated bet with the original to know if it is completing the bet or just making an update to amount or description
        let statusChanged = true
        let notificationType = 'betUpdateAccept'

        try {
            dispatch(updateBet(bet, statusChanged))
        } catch (err) {
            console.error(err)
        }
        sendBetUpdateResponse(bet, user, person, notificationType)
        deleteNotification(notiId)
        props.navigation.navigate('Notifications')

    }

    const handleDeclineUpdate = () => {
        let notificationType = 'betUpdateDecline'

        sendBetUpdateResponse(bet, user, person, notificationType)
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
        props.navigation.navigate('Notifications')

    }

    const getButtonTitles = () => {
        switch (notiData.type){
            case 'betRequest':
                return {accept: 'Accept Bet', decline: 'Decline Bet'}
            case 'betDelete':
                return {accept: 'Accept Deletion', decline: 'Decline Deletion'}
            case 'betUpdate':
                return {accept: 'Accept Update', decline: 'Decline Update'}
        }
    }

    return (
        !isLoading
            ? <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.text}>Other Bettor:</Text>
                    <Text style={styles.text}>{infoToDisplayBasedOnUser.displayOtherName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>{bet.creator_id == userId ? 'Your' : infoToDisplayBasedOnUser.otherBettorName+"'s"} bet amount:</Text>
                    <Text style={styles.text}>${parseFloat(bet.amount).toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>{bet.other_id == userId ? 'Your' : infoToDisplayBasedOnUser.displayOtherName+"'s"} bet amount:</Text>
                    <Text style={styles.text}>${bet.potentialWinnings ? parseFloat(bet.potentialWinnings).toFixed(2) : parseFloat(bet.amount).toFixed(2)}</Text>
                </View>
                <View style={[styles.row, { flexDirection: 'column' }]}>
                    <Text style={[styles.text, { marginBottom: 10 }]}>Description:</Text>
                    <Text style={styles.text}>{bet.description}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Status:</Text>
                    {notiData.type == 'betDelete'
                        ?<Text style={styles.text}>{'Deleted'}</Text>
                        :<Text style={styles.text}>{status ? 'Complete' : 'Pending'}</Text>
                    }
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Winner of Bet:</Text>
                    <Text style={styles.text}>{bet.won_bet == userId ? 'You' : (bet.won_bet == infoToDisplayBasedOnUser.otherId ? infoToDisplayBasedOnUser.otherBettorName : 'Undecided') }</Text>
                </View>

                {!needsAction
                    ? null
                    : <View style={styles.btnRow}>
                        <Button
                            title={getButtonTitles().accept}
                            type="outline"
                            buttonStyle={[styles.btn, styles.btnAccept]}
                            titleStyle={{ color: 'white', fontWeight: 'bold' }}
                            onPress={() => handleAccept()}
                        />
                        <Button
                            title={getButtonTitles().decline}
                            type="outline"
                            buttonStyle={[styles.btn, styles.btnDecline]}
                            titleStyle={{ color: 'white', fontWeight: 'bold' }}
                            onPress={() => notiData.type === 'betUpdate' ? handleDeclineUpdate() :  handleDeclined()}

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
        backgroundColor: Colors.backgroundColor,
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
        borderBottomColor: Colors.grayLight
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
        padding: 15,
        width: 'auto',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    btnAccept: {
        backgroundColor: Colors.venmoBlue,
        borderColor: Colors.green
    },
    btnDecline: {
        backgroundColor: Colors.red,
        borderColor: Colors.red
    }
})