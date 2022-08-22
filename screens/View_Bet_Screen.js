import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, Platform, Alert, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { updateBet } from '../store/actions/bets';
import { deleteBet } from '../store/actions/bets';
import Modal from 'react-native-modal'
import { KeyboardAvoidingView } from 'react-native';
import { set } from 'react-native-reanimated';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { sendBetDeleteRequest, sendBetUpdate } from '../store/actions/notifications';
import { completedCriteria } from '../constants/utils';
import { MaterialIcons } from '@expo/vector-icons';
import TestComponent from '../components/TestComponent'
import VenmoBtn from '../components/VenmoBtn';
import {reportItemDialog} from "../utils/utils";
import Edit_Bet_Screen from "./Edit_Bet_Screen";


const View_Bet_Screen = props => {

    const { description, amount, other_bettor, date, won_bet, is_complete, id, is_open, date_complete, is_verified, is_accepted, creator_id, other_id, creator } = props.route.params.bet
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
    // const [toggleModal, setToggleModal] = useState(props.modalVisible)
    const [hasPermission, setHasPermissions] = useState(props.route.params.permissions)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: editMode ? 'Update Bet' : 'Bet Details',
            headerLeft: () => {

                return (
                    editMode ?
                        <TouchableOpacity {...props}>
                            <Ionicons
                                name="md-arrow-back-sharp"
                                size={28}
                                color="white"
                                // style={{ paddingBottom: 5 }}
                                onPress={() => setEditMode(false)}
                            />
                        </TouchableOpacity>
                        : <View></View>
                )
            },
            headerRight: () => {
                return (
                    <TouchableOpacity {...props}>
                        <AntDesign
                            name="close"
                            size={22}
                            color="white"
                            // style={{ paddingBottom: 5 }}
                            onPress={() => closeModal()}
                        />
                    </TouchableOpacity>
                )
            }
        })
    }, [editMode])


    let betStatusText = ''
    if (is_verified && !is_accepted) {
        betStatusText = 'Pending acceptance'
    } else if (is_verified && is_accepted && is_complete || !is_verified && is_complete) {
        betStatusText = 'Complete'
    } else {
        betStatusText = 'Pending'
    }

    let betWonText = userId == won_bet ? user.firstName : (otherPersonId == won_bet ? otherPerson.firstName : 'Undecided')

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
        // setToggleModal(false)
        // setTimeout(() => {
        //     props.toggleModal(!props.modalVisible)
        // }, 500)
    }

    const handleUpdateBet = async () => {
        const betData = props.route.params.bet
        betData.other_bettor.firstName = nameOfBettor
        betData.amount = parseFloat(betAmount)
        betData.is_complete = betComplete
        betData.won_bet = betWon ? userId : otherPersonId
        betData.description = betDescription

        const statusChanged = completedCriteria(props.route.params.bet) != completedCriteria(betData) ? false : true
        if (!hasPermission) {
            let type = 'betUpdate'
            sendBetUpdate(betData, user, otherPerson, type)
            closeModal()
            return
        }

        closeModal()
        dispatch(updateBet(betData, statusChanged))


    }

    const handleDeleteBet = () => {
        let betData = props.route.params.bet
        if (!hasPermission) {
            let type = 'betDelete'
            sendBetDeleteRequest(betData, user, otherPerson, type)
            closeModal()
            return
        }
        closeModal()
        dispatch(deleteBet(id))


    }
    const goToUser = () => {
        // console.log('go to user')
        // console.log(otherPerson)
    }

    const showConfirmDialog = () => {
        return Alert.alert(
            "Are your sure you want to delete this bet?",
            "",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        handleDeleteBet()
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

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

    const showDeleteAlert = () => {
        return Alert.alert(
            "Both betters will need to confirm this delete. Send delete request?",
            "",
            [
                {
                    text: "Send Notification",
                    onPress: () => {
                        handleDeleteBet()
                    },
                },
                {
                    text: "Back",
                },
            ]
        );
    };

    return (
        !editMode
            ?
            <View style={[styles.container]}>
                {/* <View style={styles.titleContainer}>

                <Text style={styles.pageTitle}>Bet Details</Text>
            </View> */}
                <View style={styles.detailsContainer}>
                    {!is_open
                        ?
                        <View style={[styles.detailRow]}>
                            <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bettors: </Text>
                            <Text style={styles.betText}>{creator.firstName} vs. {other_bettor.firstName}</Text>
                        </View>
                        : null
                    }

                    <View style={styles.detailRow}>
                        <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bet Amount: </Text>
                        <Text style={styles.betText}>${parseFloat(Math.abs(amount)).toFixed(2)}</Text>
                    </View>
                    <View behavior='position'>
                        <View style={styles.detailRow}>
                            <Text style={[styles.betText, { fontWeight: 'bold', width: '30%' }]} >Description: </Text>
                            <Text style={[styles.betText, styles.description]} numberOfLines={4}>{description}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.detailRow, styles.betStatusContainer]}>
                            <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Status: </Text>
                            <Text style={[styles.coloredCompleteText, styles.statusText]}>{betStatusText}</Text>
                        </View>
                        {!is_open
                            ?
                            <View style={[styles.detailRow, styles.betStatusContainer]}>
                                <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Bet Won: </Text>
                                <Text style={[styles.coloredWonText, styles.statusText]}>{betWonText}</Text>
                            </View>
                            : null
                        }
                    </View>
                </View>
                {userId == creator_id || userId == other_id
                    ? <View style={styles.btnsPosition}>
                        <View>
                            <VenmoBtn
                                otherPerson={otherPerson}
                                amount={amount}
                                description={description}
                            />
                            <View style={styles.btnContainer}>
                                <Button
                                    iconRight
                                    title="Update"
                                    type="solid"
                                    buttonStyle={styles.updateButton}
                                    onPress={() => setEditMode(!editMode)}
                                />
                            </View>
                            <View style={styles.btnContainer}>
                                <Button
                                    title="Delete"
                                    type="solid"
                                    buttonStyle={styles.deleteButton}
                                    onPress={() => hasPermission ? showConfirmDialog() : showDeleteAlert()}
                                />
                            </View>
                        </View>
                    </View>
                    : null
                }

            </View>
            : <Edit_Bet_Screen
                {...props}
                bet={props.route.params.bet}
                permissions={props.route.params.permissions}
            />
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // position: 'absolute',
        // bottom: -20,
        width: '100%',
        backgroundColor: 'white',
        alignSelf: 'center',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20

    },
    // titleContainer: {
    //     width: '100%',
    //     backgroundColor: Colors.primaryColor,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderTopLeftRadius: 20,
    //     borderTopRightRadius: 20
    // },
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
    titleIcon: {
        margin: 15,
        alignSelf: 'flex-end',
        color: 'white',
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
        backgroundColor: Colors.primaryColor,
        width: '90%',
        alignSelf: 'center'
    },
    deleteButton: {
        backgroundColor: Colors.red,
        width: '90%',
        alignSelf: 'center'

    },
    avoidKeyboardContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        // alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }

})

export default View_Bet_Screen