import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import Colors from '../constants/colors'
import HeaderText from '../components/HeaderText';
import {FontAwesome5, Ionicons, MaterialIcons} from '@expo/vector-icons';
import BetList from '../components/BetList';
import CachedImage from 'react-native-expo-cached-image';
import {Button} from "react-native-elements";
import Stats_Screen from "./Stats_Screen";

function User_Profile_Screen(props) {

    // const [showBetsfeed, setShowBetsFeed] = useState(true)
    // const [bets, setBets] = useState([])
    const [numFriends, setNumFriends] = useState(0)


    const user = useSelector(state => state.auth.userInfo)
    const userBets = useSelector(state => state.bets.bets)
    let friendsList = useSelector(state => state.people.friends)


    useEffect(() => {
        setNumFriends(friendsList.length)
    }, [])

    // useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         title: 'My Profile',
    //         headerRight: () => {
    //             return (
    //                 <TouchableOpacity {...props}>
    //                     <MaterialIcons
    //                         name="edit"
    //                         size={24}
    //                         color="white"
    //                         style={{ paddingBottom: 5 }}
    //                         onPress={() => props.navigation.navigate('Edit Profile')}
    //                     />
    //                 </TouchableOpacity>
    //             )
    //         }
    //     })
    // }, [])

    const handleCreateBetOffer = () => {
        props.navigation.navigate('Create Bet')
    }

    const handleViewFriends = () => {

        props.navigation.navigate('Friends List')
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailsContainer}>
                <CachedImage
                    source={{ uri: user.picture }}

                    style={{ width: 110, height: 110, borderRadius: 100 }}
                />
                {/* <Image source={{ uri: profileImage }} style={{ width: 200, height: 200 }} /> */}
                <View style={styles.personInfoConatiner}>
                    <HeaderText style={styles.name}>{user.firstName} {user.lastName}</HeaderText>
                    <Text style={{marginBottom: 5}}>Username: @{user.username}</Text>
                    <Text>Venmo ID: @{user.venmo_id}</Text>
                </View>
                <View style={styles.friendsContainer}>
                    <Button
                        icon={
                            <FontAwesome5 name="edit" size={12} color={Colors.primaryColor} />
                        }
                        title='Edit Profile'
                        type="outline"
                        buttonStyle={styles.isFriendBtn}
                        titleStyle={{ fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5 }}
                        onPress={() => props.navigation.navigate('Edit Profile')}
                    />
                    {/*<Button*/}
                    {/*    icon={*/}
                    {/*        <Ionicons name="stats-chart" size={15} color={Colors.primaryColor} />*/}
                    {/*    }*/}
                    {/*    title='Stats'*/}
                    {/*    type="outline"*/}
                    {/*    buttonStyle={styles.isFriendBtn}*/}
                    {/*    titleStyle={{ fontSize: 13, color: Colors.primaryColor, fontWeight: 'bold', marginLeft: 5 }}*/}
                    {/*    onPress={() => props.navigation.navigate('Stats Screen')}*/}
                    {/*/>*/}
                </View>
                {/*<TouchableOpacity*/}
                {/*    onPress={() => handleCreateBetOffer()}*/}
                {/*    style={styles.sendBetBtn}*/}
                {/*>*/}
                {/*    <HeaderText style={styles.sendBetBtn}>{'Create New Bet'}</HeaderText>*/}
                {/*</TouchableOpacity>*/}
            </View>
            <Stats_Screen
                useProp={true}
            />
            {/*<View style={styles.toggleButtonsContainer}>*/}
            {/*    <Text style={showBetsfeed ? styles.activeToggleBtn : styles.toggleBtn} onPress={() => setShowBetsFeed(true)}>Bets Feed</Text>*/}
            {/*</View>*/}
            {/*<BetList*/}
            {/*    {...props}*/}
            {/*    bets={bets}*/}
            {/*    permissions={true}*/}
            {/*    personId={user.id}*/}
            {/*/>*/}
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