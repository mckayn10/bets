import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import Colors from '../constants/colors'
import HeaderText from '../components/HeaderText';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { addFriend, fetchAllPersonsFriends, removeFriend } from '../store/actions/friends';
import { formatBetArrayOfObjects } from '../constants/utils';
import db from '../firebase/config';
import Shared_Bets_Screen from './Shared_Bets_Screen';
import All_Bets_Screen from './All_Bets_Screen';

function Person_Profile_Screen(props) {
    const [showBetsfeed, setShowBetsFeed] = useState(true)
    const [isFriend, setIsFriend] = useState()
    const [personsBets, setPersonsBets] = useState([])
    const [mergedBets, setMergedBets] = useState([])

    const person = props.route.params.person
    const isUser = props.route.params.isUser
    const { firstName, lastName, email, username, id } = person
    const userFriends = useSelector(state => state.people.friends)
    const userBets = useSelector(state => state.bets.bets)
    const url = `https://mybets-f9188-default-rtdb.firebaseio.com`

    const dispatch = useDispatch()

    useEffect(() => {
        if (userFriends.some(person => person.id == id)) {
            setIsFriend(true)
        } else {
            setIsFriend(false)
        }
        fetchPersonsBets()
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: `${firstName} ${lastName}`,
            headerRight: () => {
                return (
                    isUser
                        ? <TouchableOpacity {...props}>
                            <MaterialIcons
                                name="edit"
                                size={24}
                                color="white"
                                style={{ marginBottom: 3, padding: 0 }}
                                onPress={() => props.navigation.navigate('Edit Profile')}
                            />

                        </TouchableOpacity>
                        : <TouchableOpacity {...props}>
                            <Ionicons
                                name="stats-chart"
                                size={22} color="black"
                                style={{ color: 'white', marginBottom: 3, padding: 0 }}
                                onPress={() => props.navigation.navigate('Stats Screen',
                                    {
                                        person: person,
                                        bets: personsBets
                                    }
                                )
                                }
                            />
                        </TouchableOpacity>

                )
            }
        })
    }, [])

    // Get all of the person's/friend's bets
    const fetchPersonsBets = async () => {
        let result1 = []
        let result2 = []
        let allResults = []
        db.ref("bets").orderByChild("creator_id").equalTo(id).on("value", function (snapshot) {
            result1 = snapshot.val()
            db.ref("bets").orderByChild("other_id").equalTo(id).on("value", function (snapshot) {
                result2 = snapshot.val()
                allResults = {
                    ...result1,
                    ...result2
                }
                let formattedArr = formatBetArrayOfObjects(allResults)
                setPersonsBets(formattedArr)
                let mergedBets = personsBets.concat(userBets)
                setMergedBets(mergedBets)
            });
        });
    }



    const handleAddFriend = () => {
        dispatch(addFriend(person))

        setIsFriend(true)
    }

    const handleRemoveFriend = () => {
        try {
            dispatch(removeFriend(id))
        }
        catch (err) {
            console.err(err)
        }
        setIsFriend(false)

    }

    const showConfirmDialog = () => {
        return Alert.alert(
            "Are your sure you want to remove this friend?",
            "",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        handleRemoveFriend(id)
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <Image
                    source={require('../assets/profile-placeholder.png')}
                    style={{ width: 120, height: 120, opacity: .3 }}
                />
                <View style={styles.personInfoConatiner}>
                    <HeaderText style={styles.name}>{firstName} {lastName}</HeaderText>
                    <Text>@{username}</Text>
                </View>
                <View style={styles.friendsContainer}>
                    {isFriend
                        ? <Button
                            icon={<FontAwesome5 name="user-check" size={12} color={Colors.primaryColor} />}
                            title='Friends'
                            type="outline"
                            buttonStyle={styles.isFriendBtn}
                            titleStyle={{ fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5 }}
                            onPress={() => showConfirmDialog()}
                        />
                        : <Button
                            icon={<Ionicons name="person-add" size={13} color='white' />}
                            title='Add Friend'
                            type="outline"
                            buttonStyle={styles.addFriendBtn}
                            titleStyle={{ fontSize: 13, color: 'white', fontWeight: 'bold', marginLeft: 5 }}
                            onPress={() => handleAddFriend()}
                        />
                    }
                    <Button
                        icon={
                            <FontAwesome5 name="user-friends" size={12} color={Colors.primaryColor} />
                        }
                        title="25 friends"
                        type="outline"
                        buttonStyle={styles.isFriendBtn}
                        titleStyle={{ fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5 }}
                    />
                </View>
                <HeaderText style={styles.sendBetBtn}>{isUser ? 'Create New Bet' : 'Send Bet Offer'}</HeaderText>
            </View>
            <View style={styles.toggleButtonsContainer}>
                <Text style={showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(true)}>Bets Feed</Text>
                <Text style={!showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(false)}>Between You</Text>
            </View>
            {showBetsfeed
                ? <All_Bets_Screen
                    personId={id}
                    bets={personsBets}
                    permissions={false}
                />
                : <Shared_Bets_Screen
                    personId={id}
                    bets={mergedBets}
                    permissions={false}
                />
            }



        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        // alignItems: 'center'
    },
    detailsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark,
        backgroundColor: Colors.backgroundColor
    },
    personInfoConatiner: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 25,
        paddingBottom: 10
    },
    friendsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        margin: 15
    },
    addFriendBtn: {
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        padding: 5,
        margin: 5,
        width: 120,
        textAlign: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        fontSize: 12,
        backgroundColor: Colors.primaryColor
    },
    isFriendBtn: {
        borderWidth: 1,
        borderColor: Colors.grayDark,
        padding: 5,
        margin: 5,
        width: 120,
        textAlign: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        fontSize: 12
    },
    toggleButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: Colors.grayDark,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark,
        padding: 1
    },
    toggleBtn: {
        borderWidth: 1,
        borderColor: 'white',
        width: '50%',
        textAlign: 'center',
        padding: 8,
        fontWeight: 'bold',
        color: 'white'
    },
    activeToggleBtn: {
        borderWidth: 1,
        borderColor: 'white',
        width: '50%',
        textAlign: 'center',
        padding: 8,
        backgroundColor: Colors.backgroundColor,
        color: Colors.primaryColor,
        fontWeight: 'bold'
    },
    sendBetBtn: {
        color: 'white',
        backgroundColor: Colors.primaryColor,
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
        fontSize: 18,
    }
})

export default Person_Profile_Screen;