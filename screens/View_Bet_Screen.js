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



const View_Bet_Screen = props => {



    const { description, amount, other_bettor, date, won_bet, is_complete, id, date_complete, is_verified, is_accepted, creator_id, other_id, creator } = props.route.params.bet
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

    let betWonText = userId == won_bet ? 'Yep' : (otherPersonId == won_bet ? 'Nope' : 'Undecided')

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
        betData.amount = parseInt(betAmount)
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
        <View style={[styles.container]}>
            {/* <View style={styles.titleContainer}>

                <Text style={styles.pageTitle}>Bet Details</Text>
            </View> */}
            <View style={styles.detailsContainer}>
                <View style={editMode ? styles.editDetailRow : styles.detailRow}>
                    <Text style={[styles.betText, { fontWeight: 'bold' }]}>Other Bettor: </Text>
                    {!editMode
                        ? <Text style={styles.betText}>{props.route.params.infoToDisplayBasedOnUser.displayOtherName}</Text>
                        : <Input
                            style={styles.input}
                            leftIcon={<Icon style={styles.icon} name='user' size={20} color={Colors.primaryColor} />}
                            onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                            defaultValue={other_bettor.firstName + ' ' + other_bettor.lastName}
                            disabled={hasPermission ? false : true}
                        />
                    }
                </View>
                <View style={editMode ? styles.editDetailRow : styles.detailRow}>
                    <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bet Amount: </Text>
                    {!editMode
                        ? <Text style={styles.betText}>${parseFloat(Math.abs(amount)).toFixed(2)}</Text>
                        : <Input
                            style={styles.input}
                            placeholder='0.00'
                            leftIcon={<Icon style={styles.icon} name='dollar' size={20} color={Colors.primaryColor} />}
                            keyboardType='numeric'
                            onChangeText={betAmount => setBetAmount(betAmount)}
                            defaultValue={amount.toString() + '.00'}
                        />
                    }

                </View>
                <View behavior='position'>
                    <View style={editMode ? styles.editDetailRow : styles.detailRow}>
                        <Text style={[styles.betText, { fontWeight: 'bold', width: '100%' }]} >Description: </Text>
                        {!editMode
                            ? <Text style={styles.betText} numberOfLines={4}>{description}</Text>
                            : <Input
                                style={styles.input}
                                onChangeText={betDescription => setBetDescription(betDescription)}
                                defaultValue={description}
                            />
                        }

                    </View>
                </View>
                {!editMode
                    ? <View>
                        <View style={[styles.detailRow, styles.betStatusContainer]}>
                            <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Status: </Text>
                            <Text style={[styles.coloredCompleteText, styles.statusText]}>{betStatusText}</Text>
                        </View>

                        <View style={[styles.detailRow, styles.betStatusContainer]}>
                            <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Bet Won: </Text>
                            <Text style={[styles.coloredWonText, styles.statusText]}>{betWonText}</Text>
                        </View>


                    </View>
                    : <View>
                        <View style={[styles.detailRow, styles.betStatusContainer]}>
                            <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Is this bet complete? </Text>
                            <Switch
                                value={betComplete}
                                color={Colors.primaryColor}
                                onValueChange={() => setBetComplete(!betComplete)}
                            />
                        </View>
                        {betComplete
                            ? <View style={[styles.detailRow, styles.betStatusContainer]}>
                                <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Did you win this bet? </Text>
                                <Switch
                                    value={betWon}
                                    color={Colors.primaryColor}
                                    onValueChange={() => setBetWon(!betWon)}
                                />
                            </View>
                            : null
                        }

                    </View>
                }
            </View>
            <View style={styles.btnsPosition}>
                {!editMode
                    ?
                    <View>
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
                    : <View style={styles.btnContainer}>
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
                }
            </View>
        </View>
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
        alignSelf: 'center',
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