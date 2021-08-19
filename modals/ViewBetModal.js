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


const ViewBetModal = props => {
    const { description, amount, other_bettors, date, won_bet, is_complete, id, date_complete } = props.betData

    const [editMode, setEditMode] = useState(false)
    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState(0);
    const [betDescription, setBetDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [toggleModal, setToggleModal] = useState(props.modalVisible)

    useEffect(() => {
        setNameOfBettor(other_bettors)
        setBetAmount(amount)
        setBetDescription(description)
        setBetWon(won_bet)
        setBetComplete(is_complete)
        return () => {
            setEditMode(false)
            setNameOfBettor('')
            setBetAmount(0)
            setBetDescription('')
            setBetComplete(false)
            setBetWon(false)
        }
    }, [amount, is_complete, description, other_bettors, won_bet])

    const dispatch = useDispatch()

    const closeModal = () => {
        setToggleModal(false)
        setTimeout(() => {
            props.toggleModal(!props.modalVisible)
        }, 500)
    }

    const handleUpdateBet = async () => {
        const data = {
            other_bettors: nameOfBettor,
            amount: parseInt(betAmount),
            description: betDescription,
            is_complete: betComplete,
            won_bet: betComplete ? betWon : false,
            id: id,
            date: date,
            date_complete: date_complete
        }
        const statusChanged = is_complete == betComplete ? false : true

        closeModal()
        setTimeout(() => {
            dispatch(updateBet(data, statusChanged))
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


        >
            <KeyboardAvoidingView style={styles.container} behavior='position' contentContainerStyle={styles.avoidKeyboardContainer}>
                <View style={styles.titleContainer}>
                    {editMode
                        ? <TouchableOpacity
                            style={[styles.titleIcon, styles.leftIcon]}
                            onPress={() => setEditMode(!editMode)}
                        >
                            <AntDesign name="back" size={25} color="white" />
                        </TouchableOpacity>
                        : <TouchableOpacity
                            style={[styles.titleIcon, styles.leftIcon]}
                            onPress={() => setEditMode(!editMode)}
                        >
                            <FontAwesome
                                name="edit"
                                size={25}
                                color="white"
                            />
                        </TouchableOpacity>
                    }
                    <Text style={styles.pageTitle}>Bet Details</Text>
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
                        <Text style={[styles.betText, { fontWeight: 'bold' }]}>Bettor(s): </Text>
                        {!editMode
                            ? <Text style={styles.betText}>{other_bettors}</Text>
                            : <Input
                                style={styles.input}
                                leftIcon={<Icon style={styles.icon} name='user' size={20} color={Colors.primaryColor} />}
                                onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                                defaultValue={other_bettors}
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
                            <Text style={[styles.betText, { fontWeight: 'bold' }]} >Description: </Text>
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
                                <Text style={[styles.coloredCompleteText, styles.statusText]}>{is_complete ? 'is_complete' : 'Incomplete'}</Text>
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
                                <Text style={[{ fontWeight: 'bold' }, styles.statusText]}>Is this bet is_complete? </Text>
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

                    {!editMode
                        ?
                        <View>
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
                                    icon={
                                        <AntDesign name="delete" size={24} color="white" />
                                    }
                                    iconRight
                                    title="Delete Bet  "
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
                                buttonStyle={styles.updateButton}
                                onPress={() => handleUpdateBet()}
                            />
                        </View>
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
        height: Platform.OS === 'ios' ? '72%' : '86%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20

    },
    titleContainer: {
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
        paddingTop: 0,
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
        textAlign: 'center',
        paddingLeft: 15,
        color: 'white'
    },
    titleIcon: {
        margin: 15,
        alignSelf: 'flex-end',
        color: 'white'
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
        width: '100%'
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
        backgroundColor: Colors.primaryColor
    },
    deleteButton: {
        backgroundColor: Colors.red
    },
    avoidKeyboardContainer: {
        width: '100%',
        backgroundColor: 'white',
        // alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }

})

export default ViewBetModal