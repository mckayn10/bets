import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import Colors from '../constants/colors'
import HeaderText from '../components/HeaderText';
import { MaterialIcons } from '@expo/vector-icons';
import BetList from '../components/BetList';
import CachedImage from 'react-native-expo-cached-image';

function User_Profile_Screen(props) {

    const [showBetsfeed, setShowBetsFeed] = useState(true)
    const [bets, setBets] = useState([])

    const user = useSelector(state => state.auth.userInfo)
    const userBets = useSelector(state => state.bets.bets)

    useEffect(() => {
        setBets(userBets)
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'My Profile',
            headerRight: () => {
                return (
                    <TouchableOpacity {...props}>
                        <MaterialIcons
                            name="edit"
                            size={24}
                            color="white"
                            style={{ paddingBottom: 5 }}
                            onPress={() => props.navigation.navigate('Edit Profile')}
                        />
                    </TouchableOpacity>
                )
            }
        })
    }, [])

    const handleCreateBetOffer = () => {
        props.navigation.navigate('Create Bet')
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <CachedImage
                    source={{ uri: user.picture }}

                    style={{ width: 150, height: 150, borderRadius: 100 }}
                />
                {/* <Image source={{ uri: profileImage }} style={{ width: 200, height: 200 }} /> */}
                <View style={styles.personInfoConatiner}>
                    <HeaderText style={styles.name}>{user.firstName} {user.lastName}</HeaderText>
                    <Text>@{user.username}</Text>
                </View>
                <View style={styles.friendsContainer}>

                </View>
                <TouchableOpacity
                    onPress={() => handleCreateBetOffer()}
                    style={styles.sendBetBtn}
                >
                    <HeaderText style={styles.sendBetBtn}>{'Create New Bet'}</HeaderText>
                </TouchableOpacity>
            </View>
            <View style={styles.toggleButtonsContainer}>
                <Text style={showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(true)}>Bets Feed</Text>
            </View>
            <BetList
                {...props}
                bets={bets}
                permissions={true}
                personId={user.id}
            />
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

export default User_Profile_Screen;