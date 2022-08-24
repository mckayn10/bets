import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Pressable, Image, Alert} from 'react-native';
import Colors from '../constants/colors';
import { useSelector, useDispatch } from 'react-redux';
import {AntDesign, FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import { getProfilePic } from '../store/actions/auth';
import CachedImage from 'react-native-expo-cached-image';
import { placeholderPic } from '../constants/urls';
import {Button} from "react-native-elements";
import {completedCriteria} from "../constants/utils";
import {updateBet} from "../store/actions/bets";
import {deleteNotification, sendBetResponse} from "../store/actions/notifications";
import {getBetComments} from "../utils/utils";
import {FontAwesome} from "@expo/vector-icons";


export default function BetCard(props) {
    const [profileImage, setProfileImage] = useState()
    const [numComments, setNumComments] = useState(0)
    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)
    const comments = useSelector(state => state.bets.comments)
    const dispatch = useDispatch()

    const { description, amount, other_bettor, other_id, date, won_bet, is_complete, is_verified, is_accepted, creator, creator_id, date_complete, is_open, id } = props.bet
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

    useEffect(() =>{
        let numberOfComments = getBetComments(id, comments)
        setNumComments(numberOfComments.length)
    }, [comments])



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
            console.log(props.route.name)

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
                    return ' won a bet with '
                } else {
                    return ' lost a bet with '
                }
            } else {
                if(is_accepted || !is_verified){
                    return ' bet with '
                } else {
                    return ' sent a bet to '
                }
            }
        }

    }
    const handleAcceptOpenBetOffer = () => {
        let updatedBet = props.bet
        updatedBet.is_accepted = true
        updatedBet.other_id = userId
        updatedBet.other_bettor = user
        updatedBet.is_open = false
        updatedBet.is_verified = true
        let statusChanged = completedCriteria(updatedBet)
        let notificationType = 'betAccept'

        try {
            dispatch(updateBet(updatedBet, statusChanged))
        } catch (err) {
            console.error(err)
        }
        sendBetResponse(updatedBet, notificationType)
    }

    const confirmAcceptOpenBet = () => {
        return Alert.alert(
            "Are you sure you want to accept this bet offer?",
            "",
            [
                {
                    text: "No",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        handleAcceptOpenBetOffer()
                    },
                },
            ]
        );
    };

    const getOpenBetTitle = () => {
        if(props.feed){
            return (
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text onPress={() => openPersonProfile(creator)} style={{fontWeight: 'bold'}}>{creator_id === userId ? 'You' : `${creator.firstName}` } </Text>
                            <Text>{creator_id === userId ? 'have' : 'has' } </Text>
                            <Text>posted a bet offer</Text>
                        </Text>
                    </View>
                    <Text style={styles.date}>{parsedDateCreated.toLocaleDateString()}</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text onPress={() => openPersonProfile(creator)} style={{fontWeight: 'bold'}}>Open Bet Offer</Text>
                        </Text>
                    </View>
                    <Text style={styles.date}>{parsedDateCreated.toLocaleDateString()}</Text>
                </View>
            )
        }
    }

    const openBetButtons = () => {
        return (
            <Button
                title='Accept'
                buttonStyle={[styles.btn]}
                titleStyle={{ color: 'white', fontSize: 14 }}
                onPress={() => confirmAcceptOpenBet()}
            />
        )
    }

    const getBetTitle = () => {
        if(props.feed){
            return (
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {is_verified
                            ? <AntDesign name='checkcircle' size={13} color={Colors.primaryColor} style={{marginRight: 3, alignSelf: 'flex-start', marginTop: 2}}/>
                            : null
                        }
                        <Text style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text onPress={() => openPersonProfile(creator)} style={{fontWeight: 'bold'}}>{creator_id === userId ? 'You' : creator.firstName }</Text>
                             {getBetTitleResult()}
                            <Text onPress={() => openPersonProfile(other_bettor)} style={is_verified ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{other_id === userId ? 'You' : `${other_bettor.firstName}` }</Text>
                        </Text>
                        {/*<Pressable onPress={() => openPersonProfile(creator)}><Text style={{fontWeight: 'bold'}}>{creator_id === userId ? 'You' : creator.firstName } </Text></Pressable>*/}
                        {/*<Pressable style={{fontWeight: 'light'}}><Text>{getBetTitleResult()}</Text></Pressable>*/}
                        {/*<Pressable onPress={() => openPersonProfile(other_bettor)}><Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}> {other_id === userId ? 'You' : other_bettor.firstName } </Text></Pressable>*/}
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
                        <Text style={is_verified ? {fontWeight: 'bold'} : {fontWeight: 'normal'}} onPress={() => openPersonProfile(infoToDisplayBasedOnUser.opponent)}>{infoToDisplayBasedOnUser.otherBettorname}</Text>
                    </View>
                    <View >
                        <Text style={styles.date}>{parsedDateCreated.toLocaleDateString()}</Text>
                    </View>
                </View>
            )

        }
    }


    const displayStatus = () => {
        if(is_open){
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, marginTop: 3 }}>Open</Text>
        }
        else if (!is_accepted && is_verified) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-minus-outline" size={22} color={Colors.red} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, marginTop: 3 }}>Pending</Text>
        }
        else if (!is_verified && !is_complete) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check-outline" size={22} color={Colors.primaryColor} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, color: Colors.primaryColor, marginTop: 3 }}>Pending</Text>

        }
        else if (!is_accepted && !is_verified && is_complete) {
            // return <MaterialCommunityIcons style={{ alignSelf: 'flex-end' }} name="account-multiple-check-outline" size={22} color={Colors.primaryColor} />
            return <Text style={{ alignSelf: 'flex-end', fontSize: 10, color: Colors.primaryColor, marginTop: 3 }}>Complete</Text>

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
                <View style={{flexDirection: 'row', width: '70%'}}>
                    <Pressable onPress={() => openPersonProfile(creator)}>
                        <CachedImage
                            style={styles.image}
                            source={{
                                uri: profileImage,
                                // headers: { Authorization: 'token' }
                            }}
                        />
                    </Pressable>
                    <View style={styles.descriptionContainer}>
                        <Pressable style={styles.personContainer}>
                            <View style={{ flexDirection: 'row', paddingRight: 12}}>
                                {is_open ? getOpenBetTitle() : getBetTitle()}
                            </View>
                        </Pressable>
                        <Text style={styles.description} numberOfLines={5}>{props.bet.description}</Text>
                    </View>
                </View>

                <View style={styles.amountContainer}>
                    {creator_id === userId || other_id === userId || is_open
                        ? <Text style={[ styles.amount, !isPending ? (won_bet != props.personId ? styles.negative : styles.positive) : '']}>
                            {!isPending ? (won_bet != props.personId ? '-' : '+') : ''}${parseFloat(Math.abs(amount)).toFixed(2)}
                          </Text>
                        : null
                    }
                    {displayStatus()}
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                <Text style={{marginLeft: 59, fontSize: 15}}>{numComments} </Text>
                <FontAwesome name="comments-o" size={20}  />
                {is_open && creator_id != userId ? openBetButtons() : null}
                {/*<View style={styles.bottomContainer}>*/}

                {/*</View>*/}
            </View>

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
        width: 50,
        height: 50,
        borderRadius: 100,
        marginRight: 8,
    },
    btn: {
        width: 100,
        alignSelf: 'flex-end',
        fontSize: 12
    }
});