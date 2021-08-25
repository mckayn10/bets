import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Platform, Alert, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { updateBet } from '../store/actions/bets';
import { deleteBet } from '../store/actions/bets';
import Modal from 'react-native-modal'
import { KeyboardAvoidingView } from 'react-native';
import { set } from 'react-native-reanimated';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';



const ViewBetModal = props => {
    const { description, amount, other_bettor, date, won_bet, is_complete, id, date_complete, is_verified, is_accepted } = props.betData

    const [editMode, setEditMode] = useState(false)
    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState(0);
    const [betDescription, setBetDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [toggleModal, setToggleModal] = useState(props.modalVisible)
    const [hasPermission, setHasPermissions] = useState(props.permissions)
    let betStatusText = ''
    if (is_verified && !is_accepted) {
        betStatusText = 'Pending acceptance'
    } else if (is_verified && is_accepted && is_complete || !is_verified && is_complete) {
        betStatusText = 'Complete'
    } else {
        betStatusText = 'Pending'
    }

    useEffect(() => {
        setNameOfBettor(other_bettor.firstName)
        setBetAmount(amount)
        setBetDescription(description)
        setBetWon(won_bet)
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
        setToggleModal(false)
        setTimeout(() => {
            props.toggleModal(!props.modalVisible)
        }, 500)
    }

    const handleUpdateBet = async () => {

        const betData = props.betData
        betData.other_bettor.firstName = nameOfBettor
        betData.amount = parseInt(betAmount)
        betData.is_complete = betComplete
        betData.won_bet = betWon
        betData.description = betDescription

        const statusChanged = is_complete == betComplete ? false : true

        closeModal()
        setTimeout(() => {
            dispatch(updateBet(betData, statusChanged))
        }, 500)

    }

    const handleDeleteBet = () => {
        closeModal()
        setTimeout(() => {
            dispatch(deleteBet(id))
        }, 500)


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

    return (
        <Modal
            isVisible={toggleModal}
            onSwipeComplete={() => closeModal()}
            swipeDirection='down'
            onBackdropPress={() => closeModal()}
            style={{ width: '98%', alignSelf: 'center' }}
        >
            <KeyboardAvoidingView
                style={[styles.container, {
                    height: hasPermission ? (Platform.OS === 'ios' ? '75%' : '86%') : '75%',
                    width: '100%',
                    margin: 0
                }]}
                behavior='position'
                contentContainerStyle={styles.avoidKeyboardContainer}>
                <View style={styles.titleContainer}>
                    {hasPermission
                        ? <View>
                            {editMode
                                ? <TouchableOpacity
                                    style={[styles.titleIcon, styles.leftIcon]}
                                    onPress={() => setEditMode(!editMode)}
                                >
                                    <AntDesign
                                        name="back"
                                        size={25}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                : <TouchableOpacity
                                    style={[styles.titleIcon, styles.leftIcon]}
                                    onPress={() => setEditMode(!editMode)}
                                >
                                    <FontAwesome
                                        name="edit"
                                        size={27}
                                        color="white"
                                        style={{ paddingTop: 2 }}
                                    />
                                </TouchableOpacity>
                            }
                        </View>
                        : null
                    }

                    <Text style={!hasPermission ? [styles.pageTitle, {marginLeft: 18}] : styles.pageTitle}>Bet Details</Text>
                    <TouchableOpacity
                        style={styles.titleIcon}
                        onPress={() => closeModal()}
                    >
                        <Ionicons
                            name="close-circle-outline"
                            size={31}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={editMode ? styles.editDetailRow : styles.detailRow}>
                        <Text style={[styles.betText, { fontWeight: 'bold' }]}>Other Bettor: </Text>
                        {!editMode
                            ? <Text style={styles.betText}>{other_bettor.firstName + ' ' + other_bettor.lastName}</Text>
                            : <Input
                                style={styles.input}
                                leftIcon={<Icon style={styles.icon} name='user' size={20} color={Colors.primaryColor} />}
                                onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                                defaultValue={other_bettor.firstName + ' ' + other_bettor.lastName}
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
                            {is_complete
                                ? <View style={[styles.detailRow, styles.betStatusContainer]}>
                                    <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Bet Won: </Text>
                                    <Text style={[styles.coloredWonText, styles.statusText]}>{won_bet ? 'Yes' : 'Nope'}</Text>
                                </View>
                                : null
                            }
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
                    {hasPermission
                        ? <View>
                            {!editMode
                                ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            iconRight
                                            title="Edit"
                                            type="solid"
                                            buttonStyle={styles.updateButton}
                                            onPress={() => setEditMode(!editMode)}
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="Delete Bet"
                                            type="solid"
                                            buttonStyle={styles.deleteButton}
                                            onPress={() => showConfirmDialog()}
                                        />
                                    </View>
                                </View>
                                : <View style={styles.btnContainer}>
                                    <Button
                                        icon={
                                            <Feather name="check-circle" size={24} color='white' />
                                        }
                                        iconRight
                                        title="Save Changes  "
                                        type="solid"
                                        buttonStyle={[styles.updateButton, {width: '90%', alignSelf: 'center'}]}
                                        onPress={() => handleUpdateBet()}
                                    />
                                </View>
                            }
                        </View>
                        : null
                    }

                </View>
            </KeyboardAvoidingView>

        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -20,
        width: '100%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20

    },
    titleContainer: {
        width: '100%',
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    detailsContainer: {
        padding: 10
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
        // paddingBottom: 15
    },
    statusText: {
        paddingBottom: 10,
        fontSize: 14,

    },
    updateButton: {
        backgroundColor: Colors.primaryColor,
        width: 150
    },
    deleteButton: {
        backgroundColor: Colors.red,
        width: 150

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

export default ViewBetModal