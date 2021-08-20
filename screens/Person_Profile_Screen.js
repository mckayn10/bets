import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Colors from '../constants/colors'
import { MaterialIcons } from '@expo/vector-icons';
import dummyFriends from '../data/dummyFriends'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';
import { SearchBar } from 'react-native-elements';
import { fetchFriendsBets } from '../store/actions/friends'
import HeaderText from '../components/HeaderText';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { addFriend } from '../store/actions/friends';
import Completed_Bets_Screen from './Completed_Bets_Screen';
import { formatBetArrayOfObjects } from '../constants/utils';

function Person_Profile_Screen(props) {
    const person = props.route.params.person
    const { firstName, lastName, email, username, id } = person
    const [showBetsfeed, setShowBetsFeed] = useState(true)
    const [isFriend, setIsFriend] = useState()
    const [bets, setBets] = useState([])

    const userFriends = useSelector(state => state.people.friends)
    const dispatch = useDispatch()
    const url = `https://mybets-f9188-default-rtdb.firebaseio.com`


    useEffect(() => {
        if (userFriends.some(person => person.id == id)) {
            setIsFriend(true)
        } else {
            setIsFriend(false)
        }
        fetchBets()
    }, [])


    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: `${firstName} ${lastName}`,
            headerLeft: () => {
                return (
                    <TouchableOpacity {...props}>
                        <AntDesign
                            name="back"
                            size={24}
                            color="white"
                            style={{ marginBottom: 3, padding: 0 }}
                            onPress={() => props.navigation.goBack()}
                        />

                    </TouchableOpacity>
                )
            }
        })
    }, [])

    const fetchBets = async () => {
        const response = await fetch(`${url}/bets/${id}.json`)

        const resData = await response.json()

        const formattedData = formatBetArrayOfObjects(resData)
        console.log('formatted', formattedData)

        setBets(formattedData)
    }

    const handleAddFriend = () => {
        dispatch(addFriend(person))

        setIsFriend(true)
    }

    const handleRemoveFriend = () => {
        console.log('remove')

        setIsFriend(false)

    }


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
                            onPress={() => handleRemoveFriend()}
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
                <HeaderText style={styles.sendBetBtn}>Send Bet Offer</HeaderText>
            </View>
            <View style={styles.toggleButtonsContainer}>
                <Text style={showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(true)}>Bets Feed</Text>
                <Text style={!showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(false)}>Between You</Text>
            </View>
            {showBetsfeed
                ? <Completed_Bets_Screen
                    bets={bets}
                    permissions={false}
                />
                : <View><Text>NOTHING HERE</Text></View>
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