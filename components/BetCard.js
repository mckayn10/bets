import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ViewBetModal from '../modals/ViewBetModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getProfilePic } from '../store/actions/auth';
import FastImage from 'react-native-fast-image';
import CachedImage from 'react-native-expo-cached-image';



export default function BetCard(props) {
    const [profileImage, setProfileImage] = useState()
    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)

    const { description, amount, other_bettor, other_id, date, won_bet, is_complete, is_verified, is_accepted, creator, creator_id } = props.bet
    const showNotAccepted = is_verified && !is_accepted

    let isPending = !is_complete && !is_verified || is_verified && !is_accepted || is_accepted && !is_complete
    let isCreator = creator_id === userId ? true : false
    let nameToDisplay = creator_id === userId ? other_bettor : creator

    let infoToDisplayBasedOnUser = {
        otherBettorname: creator_id === userId ? other_bettor.firstName : (other_id === userId ? 'You' : other_bettor.firstName),
        creatorName: creator_id === userId ? 'You' : creator.firstName,
        displayOtherName: creator_id === userId ? other_bettor.firstName + ' ' + other_bettor.lastName : creator.firstName + ' ' + creator.lastName,
        didWin: won_bet === userId ? true : false,
        opponent: creator_id === userId ? other_bettor : creator
    }
    useEffect(() => {
        getProfilePic(infoToDisplayBasedOnUser.opponent.email).then(url => {
            if (!url) {
                setProfileImage('https://firebasestorage.googleapis.com/v0/b/betz-1bfb4.appspot.com/o/profile_pictures%2Fplaceholder.png?alt=media&token=55bc2c6a-f6f2-4392-844d-29edbd88fe63')
            } else {
                setProfileImage(url)
            }
        })
    })


    // Used for showing all bets of another user
    if (props.invertName && userId != props.personId) {
        nameToDisplay = creator_id === userId ? creator : other_bettor
    }

    const openViewBet = () => {
        props.navigation.navigate('View Bet', {
            bet: props.bet,
            infoToDisplayBasedOnUser: infoToDisplayBasedOnUser,
            permissions: props.permissions
        })
    }

    const displayVerifiedIcon = () => {
        if (is_verified && !is_accepted) {
            // return <Ionicons style={{ alignSelf: 'flex-end' }} name="lock-open" size={17} color={Colors.primaryColor} />
            return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-minus-outline" size={22} color={Colors.red} />
        }
        else if (is_verified && is_accepted && !is_complete) {
            // return <Ionicons style={{ alignSelf: 'flex-end' }} name="lock-closed" size={17} color={Colors.primaryColor} />
            return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check-outline" size={22} color={Colors.primaryColor} />
        }
        else if (is_verified && is_accepted) {
            // return <Ionicons style={{ alignSelf: 'flex-end' }} name="lock-closed" size={17} color={Colors.primaryColor} />
            return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check" size={22} color={Colors.primaryColor} />
        }
    }

    return (
        <Pressable
            style={!showNotAccepted ? styles.container : styles.notAcceptedContainer}
            onPress={() => openViewBet()}
        >
            <View style={styles.descriptionContainer}>
                <View style={styles.personContainer}>
                    {/* <Ionicons
                        name="person-circle-outline"
                        size={24} color="black"
                        style={{ marginRight: 8 }}
                    /> */}
                    <CachedImage
                        style={{ width: 35, height: 35, borderRadius: 100, marginRight: 8 }}
                        source={{
                            uri: profileImage, 
                            // headers: { Authorization: 'token' }
                        }}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Text style={styles.name}>{infoToDisplayBasedOnUser.creatorName}</Text> */}
                        <Text style={styles.name}>{infoToDisplayBasedOnUser.displayOtherName}</Text>
                        <Text> bet with You</Text>
                    </View>
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
                        !isPending ? (won_bet != props.personId ? styles.negative : styles.positive) : ''
                    ]}
                >
                    {!isPending ? (won_bet != props.personId ? '-' : '+') : ''}${parseFloat(Math.abs(amount)).toFixed(2)}
                </Text>
                {displayVerifiedIcon()}

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        height: 120,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: Colors.backgroundColor,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark
        // borderRadius: 10,
        // shadowColor: '#d9d9d9',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 1,
    },
    notAcceptedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        height: 120,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: Colors.backgroundColor,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark
        // borderRadius: 10,
        // shadowColor: '#d9d9d9',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 1,
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
        marginTop: 8
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