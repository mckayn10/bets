import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Colors from "../constants/colors";
import React from "@types/react";

const BetAmountInputs = (props) => {
    return (
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
        width: '95%',
        alignSelf: 'center'
    },
    amountContainer: {
        width: '95%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5,
    },

})

export default BetAmountInputs