import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    Alert,
    ScrollView,
    SafeAreaView,
    Pressable,
    TextInput, TouchableWithoutFeedback, Keyboard
} from 'react-native'
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import { createBet } from '../store/actions/bets'
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import MySearchableDropdown from '../components/SearchableDropdown';
import {check_val} from "../utils/utils";
import DropDownPicker from 'react-native-dropdown-picker';
import HeaderText from "../components/HeaderText";


const Create_Bet_Screen = props => {

    const [nameOfBettor, setNameOfBettor] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [description, setDescription] = useState('');
    const [betComplete, setBetComplete] = useState(false);
    const [openBet, setOpenBet] = useState(false);
    const [betWon, setBetWon] = useState(false);
    const [otherBettorInfo, setOtherBetterInfo] = useState('')
    const [betTypeChosen, setBetTypeChosen] = useState(false)
    const [openOddType, setOpenOddType] = useState(false);
    const [openOddLines, setOpenOddLines] = useState(false);
    const [oddTypeChosen, setOddTypeChosen] = useState('');
    const [lineChosen, setLineChosen] = useState(false);
    const [typesOfOdds, setTypesOfOdds] = useState([]);
    const [oddsLines, setOddsLines] = useState([]);
    const [oddsBetAmount, setOddsBetAmount] = useState('');
    const [potentialWinnings, setPotentialWinnings] = useState('');
    const [isSportsBet, setIsSportsBet] = useState(props.route.params && props.route.params.matchData ? true : false)
    const [customOdds, setCustomOdds] = useState(false)
    const [betOdds, setBetOdds] = useState()

    const userInfo = useSelector(state => state.auth.userInfo)
    const person = props.route.params ? props.route.params.person : false

    useEffect(() => {
        setBetWon(false)
        setBetComplete(false)
        if (person) {
            handleSetUser(person)
        }

        if(isSportsBet){
            const dropdownItems = [
                {label: `Over/Under Total Points`, value: 'over/under', key: 1},
                {label: `Moneyline`, value: 'moneyline', key: 2},
                {label: `Spread`, value: 'spread', key: 3},
            ]
            setTypesOfOdds(dropdownItems)
        }
        return () => {

        }
    }, [])

    useEffect(() => {
        calculatePotentialWinnings(oddsBetAmount)
    }, [lineChosen])

    const onOddsTypeOpen = () => {
        setOpenOddLines(false);
    };

    const onLineTypesOpen = () => {
        setOpenOddType(false);
    };

    if(isSportsBet){
        useEffect(() => {
            const {MoneyLineHome, MoneyLineAway, PointSpreadAway, PointSpreadAwayLine, PointSpreadHome, PointSpreadHomeLine, OverLine, UnderLine, TotalNumber} = props.route.params.matchData.Odds[0]
            const {HomeTeam, AwayTeam} = props.route.params.matchData

            let lineDropdownItems = []
            if(oddTypeChosen === 'moneyline'){
                lineDropdownItems = [
                    {label: `${HomeTeam}   ${parseFloat(MoneyLineHome) > 0 ? '+' : ""}${MoneyLineHome}`, value: {team: HomeTeam, type: oddTypeChosen, line: MoneyLineHome, key: 1}},
                    {label: `${AwayTeam}   ${parseFloat(MoneyLineAway) > 0 ? '+' : ""}${MoneyLineAway}`, value: {team: AwayTeam, type: oddTypeChosen, line: MoneyLineAway, key: 2}},

                ]
            } else if (oddTypeChosen === 'over/under'){
                lineDropdownItems = [
                    {label: `Under   ${TotalNumber}   Line: ${parseFloat(UnderLine) > 0 ? '+' : ""}${UnderLine}`, value: {team: null, type: oddTypeChosen, line: UnderLine, sideChosen: 'under', key: 1}},
                    {label: `Over   ${TotalNumber}   Line: ${parseFloat(OverLine) > 0 ? '+' : ""}${OverLine}`, value: {team: null, type: oddTypeChosen, line: OverLine, sideChosen: 'under', key: 2}},
                ]
            } else if (oddTypeChosen === 'spread'){
                lineDropdownItems = [
                    {label: `${HomeTeam}   ${parseFloat(PointSpreadHome) > 0 ? '+' : ""}${PointSpreadHome}   Line: ${parseFloat(PointSpreadHomeLine) > 0 ? '+' : ""}${PointSpreadHomeLine}`, value: {team: HomeTeam, type: oddTypeChosen, spread: PointSpreadHome, line: PointSpreadHomeLine, key: 1}},
                    {label: `${AwayTeam}   ${parseFloat(PointSpreadAway) > 0 ? '+' : ""}${PointSpreadAway}   Line: ${parseFloat(PointSpreadAwayLine) > 0 ? '+' : ""}${PointSpreadAwayLine}`, value: {team: AwayTeam, type: oddTypeChosen, spread: PointSpreadAway, line: PointSpreadAwayLine, key: 2}},
                ]
            }
            setOddsLines(lineDropdownItems)

        }, [oddTypeChosen])
    }

    useEffect(() => {
        if(openBet){

        }
    }, [openBet])

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

    const sportsBetData = () => {
        let obj = props.route.params.matchData
        obj.creator_win_amount = parseFloat(oddsBetAmount)
        obj.opponent_win_amount = parseFloat(potentialWinnings)
        return obj
    }

    const createDescription = () => {
        setBetOdds(lineChosen.line)
        let obj = props.route.params.matchData
        let autoDescription = ''
        if(oddTypeChosen === 'moneyline'){
            autoDescription = `${lineChosen.team} will beat ${lineChosen.team == obj.AwayTeam ? obj.HomeTeam : obj.AwayTeam}`
        } else if (oddTypeChosen === 'over/under'){
            autoDescription = `${obj.HomeTeam} vs. ${obj.AwayTeam} will hit the ${lineChosen.sideChosen} on ${obj.Odds[0].TotalNumber} total points`
        } else if (oddTypeChosen === 'spread'){
            autoDescription = `${lineChosen.team} will cover the ${lineChosen.spread > 0 ? '+' : ''}${lineChosen.spread} spread against the ${lineChosen.team == obj.AwayTeam ? obj.HomeTeam : obj.AwayTeam}`
        }
        return autoDescription
    }

    const getBetOdds = () => {
        return lineChosen ? lineChosen.line : false
    }

    const createOpenBet = () => {
        if(isSportsBet){

        }else if (oddsBetAmount === '' || description === '') {
            Alert.alert('Please fill out all text fields')
            return false
        }

        if(!check_val(description)){
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
            description: isSportsBet ? createDescription() : description,
            amount: parseFloat(oddsBetAmount),
            other_bettor: otherBettorData ? otherBettorData : defaultOtherBettor,
            creator: userInfo,
            won_bet: betComplete ? (betWon ? userInfo.id : other_id) : 0,
            is_complete: betComplete,
            is_verified: otherBettorData ? true : false,
            is_accepted: false,
            is_open: true,
            sports_bet: isSportsBet ? sportsBetData() : false,
            potentialWinnings: parseFloat(potentialWinnings),
            bet_odds: getBetOdds(),
            lineChosen: lineChosen,
            customOdds: customOdds
        }
        let sendBetNotification = otherBettorData ? true : false

        try {
            dispatch(createBet(data, sendBetNotification))
        }
        catch (err) {
            Alert.alert('Error creating new bet. ' + err)
            console.error(err)
        }


        // console.log('props navigate value', props.navigation.getParent().getState().routes[0].name)
        let parentTab = props.navigation.getParent().getState().routes
        closeModal()
    }

    const createNewBet = () => {
        if(isSportsBet){
            createDescription()
            if (nameOfBettor === '') {
                Alert.alert('Please fill out all text fields')
                return false
            }
        } else if (nameOfBettor === '' || oddsBetAmount === '' || description === '') {
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
            description: isSportsBet ? createDescription() : description,
            amount: parseFloat(oddsBetAmount),
            other_bettor: otherBettorData ? otherBettorData : defaultOtherBettor,
            creator: userInfo,
            won_bet: betComplete ? (betWon ? userInfo.id : other_id) : 0,
            is_complete: betComplete,
            is_verified: otherBettorData ? true : false,
            is_accepted: false,
            is_open: false,
            sports_bet: isSportsBet ? sportsBetData() : false,
            potentialWinnings: parseFloat(potentialWinnings),
            bet_odds: getBetOdds(),
            lineChosen: lineChosen,
            customOdds: customOdds
        }

        let sendBetNotification = otherBettorData ? true : false

        try {
            dispatch(createBet(data, sendBetNotification))
        }
        catch (err) {
            Alert.alert('Error creating new bet. ' + err)
            console.error(err)
        }


        // console.log('props navigate value', props.navigation.getParent().getState().routes[0].name)
        let parentTab = props.navigation.getParent().getState().routes
        closeModal()

}

const calculatePotentialWinnings = (oddsBetAmount) => {
    setOddsBetAmount(oddsBetAmount)
    if(lineChosen){
        if(lineChosen.line && lineChosen.line != 0){
            let newAmount = 0
            if(parseFloat(lineChosen.line) > 0){
                newAmount = oddsBetAmount * (parseFloat(lineChosen.line) / 100)
            } else if(lineChosen.line < 0) {
                newAmount = (oddsBetAmount * 100) / parseFloat(lineChosen.line)
            } else {
                newAmount = parseFloat(oddsBetAmount)
            }
            let positiveNumber = Math.abs(newAmount)
            let roundedNum = Math.round(positiveNumber)

            console.log('yes', Math.abs(newAmount.toFixed(2))== 0)
            if(Math.abs(newAmount.toFixed(2) ) == 0){
                setPotentialWinnings('')
            } else {
                setPotentialWinnings(Math.abs(newAmount.toFixed(2)).toString())
            }
            return oddsBetAmount
        }else {
            setPotentialWinnings(oddsBetAmount.toString())
        }
    } else {
        setPotentialWinnings(oddsBetAmount.toString())
    }
}

const closeModal = () => {
    setNameOfBettor('')
    setBetAmount('')
    setDescription('')
    setBetComplete(false)
    setBetWon(false)
    setOtherBetterInfo('')
    setBetTypeChosen(false)
    setOpenBet(false)
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

const handleSetBetType = (type) => {
     if(type == 'open'){
         setOpenBet(true)
     }
    setBetTypeChosen(true)
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

const renderAmountInputs = () => {
        return (
            <View>
                <View style={styles.amountContainer}>
                    <Text style={styles.questionText}>Amount you want to bet:</Text>
                    <TextInput
                        style={styles.betAmountBox}
                        placeholder='$0.00'
                        keyboardType='numeric'
                        placeholderTextColor={Colors.grayDark}
                        onChangeText={oddsBetAmount => calculatePotentialWinnings(oddsBetAmount)}
                        defaultValue={oddsBetAmount}
                    />
                </View>
                <View style={styles.amountContainer}>
                    <View>
                        <Text style={styles.questionText}>Amount your opponent bets:</Text>
                        <TouchableOpacity>
                            <Text onPress={() => toggleCustomOdds()} style={{fontSize: 10, marginTop: 5, color: 'blue'}}>
                                {!customOdds ? 'Set Custom Odds' : 'Use Default Odds'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TextInput
                            style={[styles.betAmountBox, {borderColor: customOdds ? Colors.grayDark : 'transparent'}]}
                            placeholder='$0.00'
                            keyboardType='numeric'
                            placeholderTextColor={Colors.grayDark}
                            onChangeText={potentialWinnings => setPotentialWinnings(potentialWinnings)}
                            value={potentialWinnings}
                            defaultValue={potentialWinnings}
                            editable={customOdds ? true : false}
                        />
                    </View>
                </View>
            </View>
        )
}


const renderSportsBetCreation = () => {
        const match = props.route.params.matchData
        return(
            <View>
                {/*<Text style={{alignSelf: 'center', padding: 15}}>Make your bet selections</Text>*/}
                <View style={styles.row}>
                    <View style={styles.cellContainer}>
                        <Text numberOfLines={2} style={[styles.itemText, styles.rowTitle]}>{match.AwayTeam}</Text>
                    </View>
                    <View style={[styles.cellContainer, {width: '15%'}]}>
                        <Text style={[styles.itemText, {fontSize: 13, paddingLeft: 8, fontWeight: 'bold', textAlign: 'center'}]}>AT</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text numberOfLines={2} style={[styles.itemText, styles.rowTitle]}>{match.HomeTeam}</Text>
                    </View>
                </View>
                <DropDownPicker
                    open={openOddType}
                    onOpen={() => onOddsTypeOpen()}
                    // onChangeValue={() => createDescription()}
                    value={oddTypeChosen}
                    items={typesOfOdds}
                    itemKey='key'
                    setOpen={setOpenOddType}
                    setValue={setOddTypeChosen}
                    setItems={setTypesOfOdds}
                    placeholder={'Select your type of odds'}
                    style={styles.dropdownContainer}
                    dropDownContainerStyle={styles.dropdownContainer}
                    zIndex={2}
                />
                {oddTypeChosen
                    ?
                    <DropDownPicker
                        open={openOddLines}
                        onOpen={() => onLineTypesOpen()}
                        value={lineChosen}
                        items={oddsLines}
                        itemKey='key'
                        setOpen={setOpenOddLines}
                        setValue={setLineChosen}
                        setItems={setOddsLines}
                        placeholder={'Select your line'}
                        style={styles.dropdownContainer}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={1}
                    />
                    : null
                }
                {lineChosen
                    ? renderAmountInputs()
                    : null
                }
            </View>
        )
}

return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View scrollEnabled={false} style={styles.container}>
        {!betTypeChosen && !person
            ?
        <View style={styles.betTypeContainer}>
            <Text style={styles.betTypeTitle}>Open Bet or Bet with a Friend?</Text>
            <Text>An Open Bet is open for any of your friends to accept</Text>
            <View style={styles.btnRow}>
                <Button
                    title='Open'
                    buttonStyle={[styles.btn]}
                    titleStyle={{ color: 'white', fontWeight: 'bold' }}
                    onPress={() => handleSetBetType('open')}
                />
                <Button
                    title='Friend'
                    buttonStyle={[styles.btn]}
                    titleStyle={{ color: 'white', fontWeight: 'bold' }}
                    onPress={() => handleSetBetType('friend')}

                />
            </View>
        </View>
            :
        <View style={{height: '100%'}}>
            {!person && !openBet
                ? <View style={{ zIndex: 1 }}>
                    <MySearchableDropdown setUser={(person) => handleSetUser(person)} />
                </View>
                : null
            }

            <View style={styles.inputContainer} scrollEnabled={false}>
                <View style={openBet ? {display: 'none'} : null}>
                    <Input
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                clearInput()
                            }
                        }}
                        style={otherBettorInfo ? [styles.input, { color: Colors.green }] : styles.input}
                        placeholder='or enter a custom name here'
                        leftIcon={<Icon style={styles.icon} name='user' size={20} color={nameOfBettor ? Colors.green : Colors.red} />}
                        label="Name of the other bettor *"
                        labelStyle={{ color: 'gray' }}
                        onChangeText={nameOfBettor => setNameOfBettor(nameOfBettor)}
                        defaultValue={nameOfBettor}
                        disabled={openBet ? true : false}

                    />
                </View>
                {!isSportsBet
                    ?
                    <View>
                        <Input
                            style={styles.input}
                            placeholder='description'
                            leftIcon={<MaterialIcons name="text-snippet" size={20} color={description ? Colors.green : Colors.red} style={{ marginRight: 2 }} />}
                            label="Short description of bet *"
                            labelStyle={{ color: 'gray' }}
                            onChangeText={description => setDescription(description)}
                            defaultValue={description}
                        />
                        {!isSportsBet
                            ? renderAmountInputs()
                            : null
                        }
                        <View style={openBet ? {display: 'none'} : null}>
                            <View style={styles.betStatusContainer}>
                                <Text style={styles.questionText}>Is this bet complete?</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Pressable onPress={() => setBetComplete(!betComplete)}>
                                        <HeaderText
                                            style={[styles.radioBtn, betComplete ? styles.yesBtn : styles.noBtn]}
                                        >Yes</HeaderText>
                                    </Pressable>
                                    <Pressable onPress={() => setBetComplete(!betComplete)}>
                                        <HeaderText
                                            style={[styles.radioBtn, betComplete ? styles.noBtn : styles.yesBtn]}
                                        >No</HeaderText>
                                    </Pressable>
                                </View>
                            </View>
                            {betComplete ?
                                <View style={styles.betStatusContainer}>
                                    <Text style={styles.questionText}>Did you win this bet?</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Pressable onPress={() => setBetWon(!betWon)}>
                                            <HeaderText
                                                style={[styles.radioBtn, betWon ? styles.yesBtn : styles.noBtn]}
                                            >Yes</HeaderText>
                                        </Pressable>
                                        <Pressable onPress={() => setBetWon(!betWon)}>
                                            <HeaderText
                                                style={[styles.radioBtn, betWon ? styles.noBtn : styles.yesBtn]}
                                            >No</HeaderText>
                                        </Pressable>
                                    </View>
                                </View> : null}
                        </View>
                    </View>

                    : renderSportsBetCreation()
                }
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
                    onPress={() => openBet ? createOpenBet() : createNewBet()}
                />
            </View>
        </View>
        }
    </View>
    </TouchableWithoutFeedback>

)

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    betTypeContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'

    },
    betTypeTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    betTypeDescription: {

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
        width: 130,
        backgroundColor: Colors.primaryColor,
        fontWeight: 'bold'
    },
    itemText: {
        fontSize: 14,
        color: Colors.primaryColor,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    cellContainer: {
        width: '43%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    cellTitle: {
        fontSize: 10,
        padding: 3,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingRight: 8,
        paddingLeft: 8,
        paddingTop: 8,
        paddingBottom: 8,
    },
    rowTitle: {
        fontWeight: 'bold',
        fontSize: 17,

    },
    oddsText: {
        textAlign: 'center',
        color: '#06a60e'
    },
    dropdownContainer: {
        marginTop: 15,
        marginBottom: 15,
        width: '97%',
        alignSelf: 'center'
    },
    amountContainer: {
        width: '95%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 2,
        marginBottom: 2,
    },
    betAmountBox: {
        minWidth: 90,
        maxWidth: 130,
        borderWidth: 1,
        borderColor: Colors.grayDark,
        padding: 7,
        fontSize: 30,
        textAlign: 'center',
        borderRadius: 5
    },
    radioBtn: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.grayDark,
        width: 70,
        marginLeft: 1,
        textAlign: 'center'
    },
    yesBtn: {
        overflow: 'hidden',
        backgroundColor: Colors.primaryColor,
        color: 'white'
    },
    noBtn: {
        overflow: 'hidden',
        backgroundColor: Colors.backgroundColor,
        color: Colors.primaryColor
    }


})

export default Create_Bet_Screen;