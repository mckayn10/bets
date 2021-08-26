import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ViewBetModal from '../modals/ViewBetModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function BetCard(props) {
    const [betModalVisible, setBetModalVisible] = useState(false)
    const { description, amount, other_bettor, date, won_bet, is_complete, is_verified, is_accepted, creator, creator_id } = props.bet
    const showNotAccepted = is_verified && !is_accepted


    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)


    let isPending = !is_complete && !is_verified || is_verified && !is_accepted || is_accepted && !is_complete
    let isCreator = creator_id === userId ? true : false
    let nameToDisplay = creator_id === userId ? other_bettor : creator

    // Used for showing all bets of another user
    if (props.invertName && userId != props.personId) {
        nameToDisplay = creator_id === userId ? creator : other_bettor
    }

    const updateBetModalStatus = () => {
        const modalStatus = betModalVisible

        setBetModalVisible(!modalStatus)
    }

    const getNameToDisplay = () => {
        if(isCreator){
            return (
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.name}>you</Text>
                    <Text > bet </Text>
                    <Text style={styles.name}>{other_bettor.firstName} {other_bettor.lastName}</Text>
                </View>
            )
        } else if(!isCreator){
            return (
                <View style={{flexDirection: 'row'}}>
                <Text style={styles.name}>{other_bettor.firstName} {other_bettor.lastName}</Text>
                <Text > bet </Text>
                <Text style={styles.name}>you</Text>
            </View>
            )
            
           
        }
    }
    const displayVerifiedIcon = () => {
        if(is_verified && !is_accepted){
            return <Ionicons style={{ alignSelf: 'flex-end' }} name="lock-open" size={17} color={Colors.primaryColor} />
        } 
        else if (is_verified && is_accepted){
            return <Ionicons style={{ alignSelf: 'flex-end' }} name="lock-closed" size={17} color={Colors.primaryColor} />
        }
    }

    return (
        <TouchableOpacity
            style={!showNotAccepted ? styles.container : styles.notAcceptedContainer}
            onPress={() => updateBetModalStatus()}
        >
            <View style={styles.descriptionContainer}>
                <View style={styles.personContainer}>
                    <Ionicons
                        name="person-circle-outline"
                        size={24} color="black"
                        style={{marginRight: 8}}
                    />
                    {getNameToDisplay()}
                </View>
                <Text style={styles.description} numberOfLines={1}>{description}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
            <View style={styles.amountContainer}>
                <Text
                    style={[
                        styles.amount,
                        !isPending ? (!won_bet ? styles.negative : styles.positive) : ''
                    ]}
                >
                    {!isPending ? (!won_bet ? '-' : '+') : ''}${parseFloat(Math.abs(amount)).toFixed(2)}
                </Text>
                {/* {is_verified ? <MaterialIcons style={{ alignSelf: 'flex-end' }} name="verified" size={17} color={Colors.primaryColor} /> : null} */}
                {displayVerifiedIcon()}

            </View>
            {betModalVisible
                ? <ViewBetModal
                    toggleModal={() => setBetModalVisible(!betModalVisible)}
                    modalVisible={betModalVisible}
                    betData={props.bet}
                    permissions={props.permissions}
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
        height: 110,
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
    notAcceptedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        height: 110,
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
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        height: '100%'
    },
    negative: {
        color: Colors.red
    },
    positive: {
        color: '#04d19b'
    },
    name: {
        fontWeight: '500',
        // margin: 5
    },
    date: {
        color: 'gray',
        fontSize: 10
    }
});