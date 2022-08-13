import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, Pressable, View, Platform, Alert, ScrollView, SafeAreaView } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import { createBet } from '../store/actions/bets'
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import MySearchableDropdown from '../components/SearchableDropdown';
import * as BadWords from 'badwords/array'


const Create_Bet_Screen = props => {

    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [description, setDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [otherBettorInfo, setOtherBetterInfo] = useState('')

    const userInfo = useSelector(state => state.auth.userInfo)
    const person = props.route.params ? props.route.params.person : false

    useEffect(() => {
        setBetWon(false)
        setBetComplete(false)
        if (person) {
            handleSetUser(person)
        }
        return () => {

        }
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
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
    }, [])
    


const dispatch = useDispatch();

    function check_val(text) {
        var bad_words = BadWords['default']
        var error = 0;

        if (text.toLowerCase().split(' ').some(part => bad_words.includes(part))) {
            error = error + 1;
        }

        if (error > 0) {
            return false
        }
        else {
            return true
        }
    }




    const createNewBet = () => {

    if (nameOfBettor === '' || betAmount === '' || description === '') {
        Alert.alert('Please fill out all text fields')
        return false
    }

    if(!check_val(nameOfBettor) || !check_val(description)){
        Alert.alert('Please remove any inappropriate or offensive language before creating this bet.')
        return false
    }

    const defaultOtherBettor = {
        id: 0,
        username: 'null',
        firstName: nameOfBettor,
        lastName: '',
        email: 'null',
        did_accept: false
    }

    const otherBettorData = otherBettorInfo
    let other_id = defaultOtherBettor.id
    if (otherBettorInfo) {
        other_id = otherBettorData.id
    }

    const data = {
        description: description,
        amount: parseInt(betAmount),
        other_bettor: otherBettorData ? otherBettorData : defaultOtherBettor,
        creator: userInfo,
        won_bet: betComplete ? (betWon ? userInfo.id : other_id) : 0,
        is_complete: betComplete,
        is_verified: otherBettorData ? true : false,
        is_accepted: false
    }
    let sendBetNotification = otherBettorData ? true : false

    try {
        dispatch(createBet(data, sendBetNotification))
    }
    catch (err) {
        Alert.alert('Error creating new bet. ' + err)
        console.error(err)
    }

    let showComplete = betComplete ? true : false

    // console.log('props navigate value', props.navigation.getParent().getState().routes[0].name)
    let parentTab = props.navigation.getParent().getState().routes
    closeModal()

}

const closeModal = () => {
    setNameOfBettor('')
    setBetAmount('')
    setDescription('')
    setBetComplete(false)
    setBetWon(false)
    setOtherBetterInfo('')
    props.navigation.goBack()

}

const handleSetUser = (person) => {
    setNameOfBettor(person.firstName + " " + person.lastName)
    setOtherBetterInfo(person)
}

const clearInput = () => {
    if (otherBettorInfo) {
        setTimeout(() => {
            setOtherBetterInfo('')
            setNameOfBettor('')
        }, 50)
    }

}

return (

    <View style={styles.container}>
        {!person
            ? <View style={{ zIndex: 1 }}>
                <MySearchableDropdown setUser={(person) => handleSetUser(person)} />
            </View>
            : null
        }

        <View style={styles.inputContainer}>
            <Input
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                        clearInput()
                    }
                }}
                style={otherBettorInfo ? [styles.input, { color: Colors.primaryColor }] : styles.input}
                placeholder='or enter a custom name here'
                leftIcon={<Icon style={styles.icon} name='user' size={20} color={nameOfBettor ? Colors.primaryColor : Colors.red} />}
                label="Name of the other bettor *"
                labelStyle={{ color: 'gray' }}
                onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                defaultValue={nameOfBettor}

            />
            <Input
                style={styles.input}
                placeholder='0.00'
                leftIcon={<Icon style={styles.icon} name='dollar' size={20} color={betAmount ? Colors.primaryColor : Colors.red} />}
                label="Bet amount *"
                keyboardType='numeric'
                labelStyle={{ color: 'gray' }}
                onChangeText={betAmount => setBetAmount(betAmount)}
                defaultValue={betAmount}
            />
            <Input
                style={styles.input}
                placeholder='description'
                leftIcon={<MaterialIcons name="text-snippet" size={20} color={description ? Colors.primaryColor : Colors.red} style={{ marginRight: 2 }} />}
                label="Short description of bet *"
                labelStyle={{ color: 'gray' }}
                onChangeText={description => setDescription(description)}
                defaultValue={description}
            />
            <View style={styles.betStatusContainer}>
                <Text style={styles.questionText}>Is this bet complete?</Text>
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
        </View>
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

)

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',

    },
    titleContainer: {
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.grayDark,
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
        color: 'white'
    },
    closeIcon: {
        fontSize: 18,
        margin: 10,
        alignSelf: 'flex-end',
        color: 'white'
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
        position: 'absolute',
        bottom: 70,
        alignSelf: 'center',
        width: '90%'

    }
})

export default Create_Bet_Screen;