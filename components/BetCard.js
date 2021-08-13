import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ViewBetModal from '../modals/ViewBetModal';

export default BetCard = (props) => {
    const [betModalVisible, setBetModalVisible] = useState(false)
    const { description, amount, otherBettor, date, wonBet, complete } = props.bet

    const updateBetModalStatus = () => {
        const modalStatus = betModalVisible

        setBetModalVisible(!modalStatus)
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => updateBetModalStatus()}
        >
            <View style={styles.descriptionContainer}>
                <View style={styles.personContainer}>
                    <Ionicons name="person-circle-outline" size={24} color="black" />
                    <Text style={styles.name}>{otherBettor}</Text>
                </View>
                <Text style={styles.description} numberOfLines={1}>{description}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text
                    style={[
                        styles.amount,
                        complete ? (!wonBet ? styles.negative : styles.positive) : ''
                    ]}
                >
                    {complete ? (!wonBet ? '-' : '+') : ''}${parseFloat(Math.abs(amount)).toFixed(2)}
                </Text>
            </View>
            {betModalVisible
                ? <ViewBetModal
                    toggleModal={() => setBetModalVisible(!betModalVisible)}
                    modalVisible={betModalVisible}
                    betData={props.bet}
                />
                : null
            }

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        height: 100,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#d9d9d9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    descriptionContainer: {
        justifyContent: 'space-between',
        maxWidth: '75%',
        height: '100%'
    },
    personContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    amount: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 4
    },
    amountContainer: {
        alignSelf: 'flex-start'
    },
    negative: {
        color: Colors.red
    },
    positive: {
        color: Colors.primaryColor
    },
    name: {
        fontWeight: 'bold',
        marginLeft: 5
    },
    date: {
        color: 'gray',
        fontSize: 10
    }
});