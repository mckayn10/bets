import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native';
import Colors from '../constants/colors';
import { useSelector } from 'react-redux';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import { getProfilePic } from '../store/actions/auth';
import CachedImage from 'react-native-expo-cached-image';
import { placeholderPic } from '../constants/urls';



export default function BetCard(props) {
    const [profileImage, setProfileImage] = useState()
    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)

    const { description, amount, other_bettor, other_id, date, won_bet, is_complete, is_verified, is_accepted, creator, creator_id, date_complete } = props.bet
    const showNotAccepted = is_verified && !is_accepted
    const parsedDateUpdated = new Date(date_complete)
    const parsedDateCreated = new Date(date)

    let isPending = !is_complete && !is_verified || is_verified && !is_accepted || is_accepted && !is_complete

    let infoToDisplayBasedOnUser = {
        otherBettorname: props.personId === creator.id ? `${other_bettor.firstName} ${other_bettor.lastName}` :`${creator.firstName} ${creator.lastName}`,
        creatorName: creator_id === userId ? 'You' : creator.firstName,
        displayOtherName: creator_id === userId ? other_bettor.firstName + ' ' + other_bettor.lastName : creator.firstName + ' ' + creator.lastName,
        didWin: won_bet === userId ? true : false,
        opponent: creator_id === props.personId ? other_bettor : creator
    }
    useEffect(() => {
        let email = ''
        if(props.feed){
            email = creator.email
        } else {
            email = infoToDisplayBasedOnUser.opponent.email
        }

        getProfilePic(email).then(url => {
            if (!url) {
                setProfileImage(placeholderPic)
            } else {
                setProfileImage(url)
            }
        })
    }, [props])

    const openViewBet = () => {
        props.navigation.navigate('View Bet', {
            bet: props.bet,
            infoToDisplayBasedOnUser: infoToDisplayBasedOnUser,
            permissions: props.permissions
        })
    }

    const openPersonProfile = (person) => {
        if(!person.id){
            return;
        }
        if(person.id === user.id){
            props.navigation.push('User Profile')
        }
        else if(infoToDisplayBasedOnUser.opponent.id){
            if(props.route.name === 'Home'){
                props.navigation.push('Person Profile', {
                    person: person,
                    isUser: false
                })
            } else {
                props.navigation.push('Person', {
                    person: person,
                    isUser: false
                })
            }

        }
    }
    const getBetTitleResult = () => {
        if(props.feed){
            if(is_complete){
                if(creator_id == won_bet){
                    return 'won a bet with'
                } else {
                    return 'lost a bet with'
                }
            } else {
                if(is_accepted || !is_verified){
                    return 'bet with'
                } else {
                    return 'sent a bet to'
                }
            }
        }

    }

    const getBetTitle = () => {
        if(props.feed){
            return (
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {is_verified
                            ? <AntDesign name='checkcircle' size={13} color={Colors.primaryColor} style={{marginRight: 3}}/>
                            : null
                        }
                        <Pressable onPress={() => openPersonProfile(creator)}><Text style={{fontWeight: 'bold'}}>{creator_id === userId ? 'You' : creator.firstName } </Text></Pressable>
                        <Pressable style={{fontWeight: 'light'}}><Text>{getBetTitleResult()}</Text></Pressable>
                        <Pressable onPress={() => openPersonProfile(other_bettor)}><Text style={{fontWeight: 'bold'}}> {other_id === userId ? 'You' : other_bettor.firstName } </Text></Pressable>
                    </View>
                    <Text style={styles.date}>{parsedDateCreated.toLocaleDateString()}</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {is_verified
                            ? <AntDesign name='checkcircle' size={13} color={Colors.primaryColor} style={{marginRight: 3}}/>
                            : null
                        }
                        <Text style={{fontWeight: 'bold'}} onPress={() => openPersonProfile(infoToDisplayBasedOnUser.opponent)}>{infoToDisplayBasedOnUser.otherBettorname}</Text>
                    </View>
                    <View >
                        <Text style={styles.date}>{parsedDateCreated.toLocaleDateString()}</Text>
                    </View>
                </View>
            )

        }
    }


    const displayStatus = () => {
        if (!is_accepted) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-minus-outline" size={22} color={Colors.red} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, marginTop: 3 }}>Pending</Text>
        }
        else if (is_accepted && !is_complete) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check-outline" size={22} color={Colors.primaryColor} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, color: Colors.red, marginTop: 3 }}>Not Complete</Text>

        }
        else if (is_accepted) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check" size={22} color={Colors.primaryColor} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, color: Colors.primaryColor, marginTop: 3 }}>Complete</Text>
        }
    }

    return (
        <Pressable style={styles.container} onPress={() => openViewBet()}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <View style={{flexDirection: 'row', width: '75%'}}>
                    <View>
                        <CachedImage
                            onPress={() => openPersonProfile(creator)}
                            style={styles.image}
                            source={{
                                uri: profileImage,
                                // headers: { Authorization: 'token' }
                            }}
                        />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Pressable style={styles.personContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                {getBetTitle()}
                            </View>
                        </Pressable>
                        <Text style={styles.description} numberOfLines={5}>{description}</Text>
                    </View>
                </View>

                <View style={styles.amountContainer}>
                    {creator_id === userId || other_id === userId
                        ? <Text style={[ styles.amount, !isPending ? (won_bet != props.personId ? styles.negative : styles.positive) : '']}>
                            {!isPending ? (won_bet != props.personId ? '-' : '+') : ''}${parseFloat(Math.abs(amount)).toFixed(2)}
                          </Text>
                        : null
                    }
                    {displayStatus()}
                </View>
            </View>
            {/*<View style={styles.bottomContainer}>*/}

            {/*</View>*/}

        </Pressable>

    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 110,
        width: '100%',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    descriptionContainer: {
        display: 'flex',
        height: '100%',
        width: '100%',
    },
    bottomContainer: {
        height: 30,
        backgroundColor: 'lightblue',
        marginBottom: 5,
        marginLeft: 42
    },
    personContainer: {
        flexDirection: 'row',
    },
    amount: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: "flex-end"
    },
    amountContainer: {
    },
    negative: {
        color: Colors.red
    },
    description: {
        marginTop: 6,
        flexWrap: 'wrap',
        lineHeight: 20,
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
        fontSize: 10,
        marginTop: 5,
        marginLeft: 2
    },
    image: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 8,
    }
});