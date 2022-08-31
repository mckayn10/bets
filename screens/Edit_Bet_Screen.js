import React, { useState, useEffect, useLayoutEffect } from 'react'
import {StyleSheet, Text, View, Platform, Alert, TouchableOpacity, TextInput} from 'react-native'
import Colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { updateBet } from '../store/actions/bets';
import { deleteBet } from '../store/actions/bets';
import { sendBetDeleteRequest, sendBetUpdate } from '../store/actions/notifications';
import { completedCriteria } from '../constants/utils';

const Edit_Bet_Screen = props => {

    const { description, amount, other_bettor, date, won_bet, is_complete, id, is_open, date_complete, is_verified, is_accepted, creator_id, other_id, creator, sports_bet, lineChosen } = props.bet
    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)
    const otherPersonId = userId === creator_id ? other_id : creator_id
    const otherPerson = userId === creator_id ? other_bettor : creator

    const [editMode, setEditMode] = useState(false)
    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState(0);
    const [betDescription, setBetDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [oddsBetAmount, setOddsBetAmount] = useState('');
    const [potentialWinnings, setPotentialWinnings] = useState('');
    // const [toggleModal, setToggleModal] = useState(props.modalVisible)
    const [hasPermission, setHasPermissions] = useState(props.permissions)
    const [customOdds, setCustomOdds] = useState(false)


    useEffect(() => {
        setNameOfBettor(other_bettor.firstName)
        setBetAmount(amount)
        setBetDescription(description)
        setBetWon(won_bet === userId)
        setBetComplete(is_complete)
        if (is_verified) {
            setHasPermissions(false)
        }
        return () => {
            setEditMode(false)
            setNameOfBettor('')
            setBetAmount(0)
            setBetDescription('')
            setBetComplete(false)
            setBetWon(false)
        }
    }, [])

    const dispatch = useDispatch()

    const closeModal = () => {
        setEditMode(false)
        setNameOfBettor('')
        setBetAmount(0)
        setBetDescription('')
        setBetComplete(false)
        setBetWon(false)
        props.navigation.goBack()
    }
    const toggleCustomOdds = () => {
        let potentialAmount = ''
        if(!customOdds){
            setPotentialWinnings(potentialWinnings)
        } else {
            calculatePotentialWinnings(oddsBetAmount)
        }
        setCustomOdds(!customOdds)
    }


    const handleUpdateBet = async () => {
        const betData = props.bet
        betData.other_bettor.firstName = nameOfBettor
        betData.amount = parseFloat(betAmount)
        betData.is_complete = betComplete
        betData.won_bet = betWon ? userId : otherPersonId
        betData.description = betDescription

        const statusChanged = completedCriteria(props.bet) != completedCriteria(betData) ? false : true
        if (!hasPermission) {
            let type = 'betUpdate'
            sendBetUpdate(betData, user, otherPerson, type)
            closeModal()
            return
        }

        closeModal()
        dispatch(updateBet(betData, statusChanged))


    }

    const calculatePotentialWinnings = (oddsBetAmount) => {
        setOddsBetAmount(oddsBetAmount)
        if(lineChosen){
            if(lineChosen.type === 'spread'){
                let newAmount = (oddsBetAmount * 100) / parseFloat(lineChosen.line)
                let positiveNumber = Math.abs(newAmount)
                let roundedNum = Math.round(positiveNumber)
                if(Math.abs(newAmount.toFixed(2) == 0)){
                    setPotentialWinnings('')
                } else {
                    setPotentialWinnings(Math.abs(newAmount.toFixed(2)).toString())
                }
                return oddsBetAmount
            }
        }
    }

    const showUpdateAlert = () => {
        return Alert.alert(
            "Both bettors will need to confirm these updates. Send update request?",
            "",
            [
                {
                    text: "Send Notification",
                    onPress: () => {
                        handleUpdateBet()
                    },
                },
                {
                    text: "Back",
                },
            ]
        );
    };

    return (
        <View style={[styles.container]}>
            <View style={styles.detailsContainer}>
                {!is_open
                    ?
                    <View style={styles.editDetailRow}>
                        <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bettors: </Text>
                        <Input
                            style={styles.input}
                            leftIcon={<Icon style={styles.icon} name='user' size={20} color={Colors.green} />}
                            onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                            defaultValue={other_bettor.firstName + ' ' + other_bettor.lastName}
                            disabled={hasPermission ? false : true}
                        />
                    </View>
                    : null

                }
                {sports_bet.id
                    ?
                    <View>
                        <View style={styles.amountContainer}>
                            <Text style={styles.questionText}>Amount you want to bet:</Text>
                            <TextInput
                                style={{minWidth: 90, borderWidth: 1, borderColor: Colors.grayDark, padding: 10, fontSize: 30, borderRadius: 5}}
                                placeholder='$0.00'
                                keyboardType='numeric'
                                placeholderTextColor={Colors.grayDark}
                                onChangeText={oddsBetAmount => calculatePotentialWinnings(oddsBetAmount)}
                                defaultValue={oddsBetAmount}
                            />
                        </View>
                        <View style={styles.amountContainer}>
                            <Text style={styles.questionText}>Amount you would win:</Text>
                            <View>
                                <TextInput
                                    style={{minWidth: 90, borderWidth: 1, borderColor: customOdds ? Colors.grayDark : 'transparent', padding: 10, fontSize: 30, borderRadius: 5}}
                                    placeholder='$0.00'
                                    keyboardType='numeric'
                                    placeholderTextColor={Colors.grayDark}
                                    onChangeText={potentialWinnings => setPotentialWinnings(potentialWinnings)}
                                    value={potentialWinnings}
                                    defaultValue={potentialWinnings}
                                    editable={customOdds ? true : false}
                                />
                                <TouchableOpacity>
                                    <Text onPress={() => toggleCustomOdds()} style={{fontSize: 10, marginTop: 5, color: 'blue', alignSelf: 'center'}}>{!customOdds ? 'Set Custom Odds' : 'Use Actual Odds'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    : null

                }
                <View style={styles.editDetailRow}>
                    <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bet Amount: </Text>
                        <Input
                            style={styles.input}
                            placeholder='0.00'
                            leftIcon={<Icon style={styles.icon} name='dollar' size={20} color={Colors.green} />}
                            keyboardType='numeric'
                            onChangeText={betAmount => setBetAmount(betAmount)}
                            defaultValue={amount.toString() + '.00'}
                        />
                </View>
                <View behavior='position'>
                    <View style={styles.editDetailRow}>
                        <Text style={[styles.betText, { fontWeight: 'bold', width: '30%' }]} >Description: </Text>
                            <Input
                                style={styles.input}
                                onChangeText={betDescription => setBetDescription(betDescription)}
                                defaultValue={description}
                            />
                    </View>
                </View>
                    <View style={is_open ? {display: 'none'} : null}>
                        <View style={[styles.detailRow, styles.betStatusContainer]}>
                            <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Is this bet complete? </Text>
                            <Switch
                                value={betComplete}
                                color={Colors.green}
                                onValueChange={() => setBetComplete(!betComplete)}
                            />
                        </View>
                        {betComplete
                            ? <View style={[styles.detailRow, styles.betStatusContainer]}>
                                <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Did you win this bet? </Text>
                                <Switch
                                    value={betWon}
                                    color={Colors.green}
                                    onValueChange={() => setBetWon(!betWon)}
                                />
                            </View>
                            : null
                        }

                    </View>
            </View>
            {userId == creator_id || userId == other_id
                ? <View style={styles.btnsPosition}>
                        <View style={styles.btnContainer}>
                            <Button
                                icon={
                                    <Feather name="check-circle" size={24} color='white' />
                                }
                                iconRight
                                title={hasPermission ? 'Save Changes  ' : 'Request Changes  '}
                                type="solid"
                                buttonStyle={styles.updateButton}
                                onPress={() => hasPermission ? handleUpdateBet() : showUpdateAlert()}
                            />
                        </View>
                </View>
                : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    detailsContainer: {
        padding: 10,
        flex: 1
    },
    input: {
        marginTop: 3,
        marginBottom: 0,
        padding: 0,
        fontSize: 14

    },
    pageTitle: {
        fontSize: 20,
        color: 'white',
        padding: 15,
        alignSelf: 'center'
    },
    icon: {
        marginRight: 10
    },
    leftIcon: {
        marginBottom: 17
    },
    betStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    betText: {
        paddingBottom: 4,
        fontSize: 14,
    },
    detailRow: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        flexWrap: 'wrap',

    },
    editDetailRow: {
        padding: 0,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    btnContainer: {
        marginTop: 15,
    },
    btnsPosition: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
    },
    statusText: {
        paddingBottom: 10,
        fontSize: 14,

    },
    updateButton: {
        backgroundColor: Colors.green,
        width: '90%',
        alignSelf: 'center'
    }


})

export default Edit_Bet_Screen