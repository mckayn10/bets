import React, { useLayoutEffect, useState, useEffect } from 'react'
import { db } from '../firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import Colors from '../constants/colors'
import HeaderText from '../components/HeaderText';
import {FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { removeFriend, blockFriend, unblockFriend } from '../store/actions/friends';
import { sendFriendRequest } from '../store/actions/notifications';
import { checkIfShared } from '../constants/utils';
import { getProfilePic } from '../store/actions/auth';
import { placeholderPic } from '../constants/urls';

import BetList from '../components/BetList';

function Person_Profile_Screen(props) {

    const [showBetsfeed, setShowBetsFeed] = useState(true)
    const [isFriend, setIsFriend] = useState()
    const [personsBets, setPersonsBets] = useState([])
    const [personsFriends, setPersonsFriends] = useState([])
    const [sharedBets, setSharedBets] = useState([])
    const [requestPending, setRequestPending] = useState(false)
    const [numFriends, setNumFriends] = useState(0)
    const [profileImage, setProfileImage] = useState()
    const [isBlocked, setBlocked] = useState(false)


    const person = props.route.params.person
    const { firstName, lastName, email, username, id } = person
    const userFriends = useSelector(state => state.people.friends)
    const user = useSelector(state => state.auth.userInfo)
    const profPic = useSelector(state => state.auth)

    const dispatch = useDispatch()
    const blockedUsers = useSelector(state => state.people.blockedUsers)

    const isBlockedByUser = () => {
        console.log(id)
        console.log('blocked Users', blockedUsers)
        var found = blockedUsers.find(user => user.id === id);
        if(found){
            return true
        }
        return false
    }


    useEffect(() => {
        if (userFriends.some(person => person.id == id)) {
            setIsFriend(true)
        } else {
            setIsFriend(false)
        }
        fetchPersonsBets()
        getPersonsFriends()
        getProfilePic(email).then(url => {
            if (!url) {
                setProfileImage(placeholderPic)
            } else {
                setProfileImage(url)
            }
        })
        if(isBlockedByUser()){
            setBlocked(true)
        }
    }, [])


    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Profile',
            headerRight: () => {
                let shared = sharedBets
                return (
                    <TouchableOpacity {...props}>
                        <Ionicons
                            name="stats-chart"
                            size={22} color="black"
                            style={{ color: 'white', marginBottom: 3, padding: 0 }}
                            onPress={() => props.navigation.navigate('Stats Screen', { person: person, bets: shared })}
                        />
                    </TouchableOpacity>
                )
            }
        })
    }, [sharedBets])

    // Get all of the person's/friend's bets
    const fetchPersonsBets = () => {
        const betsRef = db.collection('bets')
        const peopleRef = db.collection("people")

        let betsArr = []

        betsRef.where("creator_id", "==", id).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let bet = doc.data()
                    bet.id = doc.id
                    // peopleRef.doc(id).get().then((person) => {
                    //     bet.creator = person.data()
                    //     if (!bet.other_bettor) {
                    //         peopleRef.doc(bet.other_id).get().then((person) => {
                    //             bet.other_bettor = person.data()
                    //             betsArr.push(bet)
                    //         })
                    //     } else {
                    //         betsArr.push(bet)
                    //     }


                    // })
                    betsArr.push(bet)

                });
                betsRef.where("other_id", "==", id).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            let bet = doc.data()
                            bet.id = doc.id
                            betsArr.push(bet)

                            // peopleRef.doc(bet.creator_id).get().then((person) => {
                            //     bet.creator = person.data()
                            //     peopleRef.doc(bet.other_id).get().then((person) => {
                            //         bet.other_bettor = person.data()
                            //         betsArr.push(bet)
                            //     })
                            // })
                        });
                        betsArr.sort(function (x, y) {
                            return y.date - x.date;
                        })
                        setPersonsBets(betsArr)
                        getSharedBets(betsArr)


                    })
            })
    }

    const getPersonsFriends = () => {
        let personsFriends = []
        db.collection('friends').doc(id).collection('friendsList').get()
            .then(querySnapshot => {
                let count = 0
                querySnapshot.forEach(doc => {
                    let friend = doc.data()
                    friend.id = doc.id
                    personsFriends.unshift(friend)
                    count++
                })
                setPersonsFriends(personsFriends)
                setNumFriends(count)
            })
    }

    const getSharedBets = (betsArr) => {
        let shared = []
        betsArr.forEach((bet) => {
            let isShared = checkIfShared(bet, person.id, user.id)
            if (isShared) {
                shared.push(bet)
            }
        })
        shared.sort(function (x, y) {
            return y.date - x.date;
        })

        setSharedBets(shared)
        return shared
    }


    const handleAddFriend = () => {
        let type = 'friendRequest'
        try {
            sendFriendRequest(user, person, type)
        }
        catch (err) {
            console.error(err)
        }
        setRequestPending(true)
    }

    const handleUnblock = () => {
        return Alert.alert(
            "Would you like to unblock this person?",
            "",
            [
                {
                    text: "Unblock",
                    onPress: () => {
                        dispatch(unblockFriend(id))
                        setBlocked(false)
                    },
                },
                {
                    text: "Report",
                    onPress: () => {
                        setBlocked(true)
                    },
                },
                {
                    text: "Cancel",
                },
            ]
        );
        setBlocked(false)
    }

    const handleBlock = () => {
        dispatch(blockFriend(id))
        dispatch(removeFriend(id))
        setBlocked(true)
    }

    const handleRemoveFriend = () => {
        try {
            dispatch(removeFriend(id))
        }
        catch (err) {
            console.error('error saving')
        }
        setIsFriend(false)
    }

    const showConfirmDialog = () => {
        return Alert.alert(
            "Are your sure you want to remove this friend?",
            "",
            [
                {
                    text: "Add Friend",
                    onPress: () => {
                        handleAddFriend()
                    },
                },
                {
                    text: "Unfriend",
                    onPress: () => {
                        handleRemoveFriend(true)
                    },
                },
                {
                    text: "Block",
                    onPress: () => {
                        handleBlock()
                    },
                },
                {
                    text: "Report",
                    onPress: () => {
                        setBlocked(true)
                    },
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    const handleSendBetOffer = () => {
        props.navigation.navigate('Create Bet', { person: person })
    }
    const handleViewFriends = () => {

        props.navigation.navigate('Persons Friends', { personsFriends: personsFriends, title: `${person.firstName}'s Friends` })
    }

    const handleCreateBetOffer = () => {
        props.navigation.navigate('Create Bet')
    }

    const handleGoToStats = () => {
        let bets = personsBets
        props.navigation.navigate('Stats Screen', { person: person, bets: personsBets })
    }

    const friendBtn = () => {
        if (isFriend && !isBlocked) {
            return (
                <Button
                    icon={<FontAwesome5 name="user-check" size={12} color={Colors.primaryColor}/>}
                    title='Friends'
                    type="outline"
                    buttonStyle={styles.isFriendBtn}
                    titleStyle={{fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5}}
                    onPress={() => showConfirmDialog()}
                />
            )
        } else if (requestPending) {
            return (
                <Button
                    title='Pending'
                    type="outline"
                    buttonStyle={[styles.addFriendBtn, {opacity: 1, backgroundColor: Colors.grayDark}]}
                    titleStyle={{fontSize: 13, color: 'white', fontWeight: 'bold', marginLeft: 5}}
                    onPress={() => showConfirmDialog()}
                    disabled={true}
                    disabledTitleStyle={{
                        color: Colors.grayLight,
                        borderColor: Colors.primaryColor,
                        backgroundColor: Colors.grayDark
                    }}
                />
            )
        }else if(isBlocked){
            return (
                <Button
                    title='Blocked'
                    type="outline"
                    buttonStyle={[styles.addFriendBtn, {opacity: 1, backgroundColor: Colors.red}]}
                    titleStyle={{fontSize: 13, color: 'white', fontWeight: 'bold', marginLeft: 5}}
                    onPress={() => handleUnblock()}
                />
            )

        }else {
            return (
                <Button
                    icon={<Ionicons name="person-add" size={13} color='white' />}
                    title='Add Friend'
                    type="outline"
                    buttonStyle={styles.addFriendBtn}
                    titleStyle={{ fontSize: 13, color: 'white', fontWeight: 'bold', marginLeft: 5 }}
                    onPress={() => handleAddFriend()}
                />
            )
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <Image
                    source={{uri: profileImage}}
                    style={{ width: 110, height: 110, borderRadius: 100 }}
                />
                <View style={styles.personInfoConatiner}>
                    <HeaderText style={styles.name}>{firstName} {lastName}</HeaderText>
                    <Text>@{username}</Text>
                </View>
                <View style={styles.friendsContainer}>
                    {friendBtn()}

                    <Button
                        icon={
                            <FontAwesome5 name="user-friends" size={12} color={Colors.primaryColor} />
                        }
                        title={numFriends + ' ' + (numFriends === 1 ? 'friend' : 'friends')}
                        type="outline"
                        buttonStyle={styles.isFriendBtn}
                        titleStyle={{ fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5 }}
                        onPress={() => handleViewFriends()}
                    />

                </View>
                <TouchableOpacity
                    onPress={() => handleSendBetOffer()}
                    style={styles.sendBetBtn}
                >
                    <HeaderText style={styles.sendBetBtn}>{'Send Bet Offer'}</HeaderText>
                </TouchableOpacity>
            </View>
            <View style={styles.toggleButtonsContainer}>
                <Text style={showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(true)}>Bets Feed</Text>

                <Text style={!showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(false)}>Between You</Text>


            </View>

            {showBetsfeed
                ? <BetList
                    {...props}
                    bets={personsBets}
                    permissions={false}
                    personId={person.id}
                />
                : <BetList
                    {...props}
                    bets={sharedBets}
                    permissions={false}
                    personId={person.id}
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
        alignItems: 'center',
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
        backgroundColor: Colors.backgroundColor,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark,
        // padding: 1
    },
    toggleBtn: {
        borderWidth: 1,
        borderColor: 'white',
        width: '50%',
        textAlign: 'center',
        padding: 8,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: Colors.grayDark,

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
        padding: 6,
        borderRadius: 5,
        overflow: 'hidden',
        fontSize: 18,
    }
})

export default Person_Profile_Screen;