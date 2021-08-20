import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Modal, Pressable, View, Platform, Alert, ScrollView, SafeAreaView } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch } from 'react-redux';
import { createBet } from '../store/actions/bets'
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import MySearchableDropdown from '../components/SearchableDropdown';


const CreateBetModal = props => {

    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [description, setDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [otherBettorInfo, setOtherBetterInfo] = useState('')

    useEffect(() => {
        setBetWon(false)
        setBetComplete(false)
        return () => {

        }
    }, [])


    const dispatch = useDispatch();

    const createNewBet = () => {
        if (nameOfBettor === '' || betAmount === '' || description === '') {
            Alert.alert('Please fill out all text fields')
            return false
        }

        const data = {
            description: description,
            amount: parseInt(betAmount),
            other_bettors: nameOfBettor,
            won_bet: betWon,
            is_complete: betComplete
        }

        try {
            dispatch(createBet(data))
        }
        catch (err) {
            Alert.alert('Error creating new bet. ' + err)
            console.error(err)
        }

        closeModal()
        let showComplete = betComplete ? true : false
        props.showComplete(showComplete)
    }

    const closeModal = () => {
        props.toggleModal(!props.modalVisible)
        setNameOfBettor('')
        setBetAmount('')
        setDescription('')
        setBetComplete(false)
        setBetWon(false)
    }

    const handleSetUser = (person) => {
        setNameOfBettor(person.name)
        setOtherBetterInfo(person)
    }

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={props.modalVisible}
            onRequestClose={() => {
                props.toggleModal(!props.modalVisible);
            }}
        >

            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.pageTitle}>Create A New Bet</Text>
                    <Pressable style={styles.closeIcon} onPress={() => closeModal()}>
                        <Text style={styles.closeIcon}>Cancel</Text>
                    </Pressable>
                </View>
                <SafeAreaView style={{zIndex: 1}}>
                    <MySearchableDropdown setUser={(person) => handleSetUser(person)}/>
                </SafeAreaView>
                <View style={styles.inputContainer}>
                    <Input
                        style={styles.input}
                        placeholder='John Doe'
                        leftIcon={<Icon style={styles.icon} name='user' size={20} color={Colors.primaryColor} />}
                        label="Name of the other bettor"
                        labelStyle={{ color: 'gray' }}
                        onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                        defaultValue={nameOfBettor}
                        autoFocus={true}
                    />
                    <Input
                        style={styles.input}
                        placeholder='0.00'
                        leftIcon={<Icon style={styles.icon} name='dollar' size={20} color={Colors.primaryColor} />}
                        label="Bet amount"
                        keyboardType='numeric'
                        labelStyle={{ color: 'gray' }}
                        onChangeText={betAmount => setBetAmount(betAmount)}
                        defaultValue={betAmount}
                    />
                    <Input
                        style={styles.input}
                        placeholder='My favorite team beat your favorite team'
                        leftIcon={<MaterialIcons name="text-snippet" size={20} color={Colors.primaryColor} />}
                        label="Short description of bet"
                        labelStyle={{ color: 'gray' }}
                        onChangeText={description => setDescription(description)}
                        defaultValue={description}
                    />
                    <View style={styles.betStatusContainer}>
                        <Text style={styles.questionText}>Is this bet completed?</Text>
                        <Switch
                            value={betComplete}
                            color={Colors.primaryColor}
                            onValueChange={() => setBetComplete(!betComplete)}
                        />
                    </View>
                    {betComplete ?
                        <View style={styles.betStatusContainer}>
                            <Text style={styles.questionText}>Did you win this bet?</Text>
                            <Switch
                                value={betWon}
                                color={Colors.primaryColor}
                                onValueChange={() => setBetWon(!betWon)}
                            />
                        </View> : null}

                    <View style={styles.btnContainer}>
                        <Button
                            icon={
                                <Feather name="check-circle" size={24} color='white' />
                            }
                            iconRight
                            title="Create Bet  "
                            type="solid"
                            buttonStyle={styles.createBtn}
                            onPress={() => createNewBet()}
                        />
                    </View>
                </View>
            </View>

        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',

    },
    titleContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.grayDark,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
        paddingTop: Platform.OS === 'ios' ? 35 : 0
    },
    inputContainer: {
        padding: 10,
    },
    input: {
        marginTop: 3,
        fontSize: 16

    },
    pageTitle: {
        fontSize: 18,
        textAlign: 'center',
        paddingLeft: 15,
        fontWeight: 'bold',
    },
    closeIcon: {
        fontSize: 18,
        margin: 10,
        alignSelf: 'flex-end',
        color: Colors.primaryColor
    },
    createBtn: {
        backgroundColor: Colors.primaryColor
    },
    icon: {
        marginRight: 10
    },
    betStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10
    },
    questionText: {
        fontSize: 16
    },
    btnContainer: {
        marginTop: 30
    }
})

export default CreateBetModal;