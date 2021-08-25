import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { formatTimeSince } from '../constants/utils';
import { addFriend } from '../store/actions/friends';
import { useDispatch } from 'react-redux';
import { deleteNotification } from '../store/actions/notifications';

export default function NotificationCard(props) {

    const { to, from, message, data, type, date, id } = props.noti

    const dispatch = useDispatch()

    const handleDeclineFriendRequest = () => {
        dispatch(deleteNotification(id))
    }

    const handleAddFriend = () => {

        try {
            dispatch(addFriend(from))
        }
        catch (err) {
            console.error(err)
        }
        dispatch(deleteNotification(id))

    }

    const openBetReview = () => {
        data.notiId = id
        props.navigation.navigate('Bet Review', {data: data})
    }

    var aDay = 24 * 60 * 60 * 1000;
    let timeSince = formatTimeSince(new Date(date - aDay))

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name="ios-person-circle-outline" size={60} color="black" />
                <Text style={styles.title}>
                    {from.firstName}
                    <Text style={{ fontWeight: '300' }}> has sent you a {type === 'bet' ? 'bet offer' : 'friend request'}</Text>
                </Text>
            </View>
            {type === 'friend'
                ? <View style={styles.btnContainer}>
                    <Button
                        title='Accept'
                        buttonStyle={[styles.btnAccept, styles.btn]}
                        titleStyle={styles.btnTitle}
                        onPress={() => handleAddFriend()}

                    />
                    <Button
                        title='Decline'
                        buttonStyle={[styles.btnDecline, styles.btn]}
                        titleStyle={styles.btnTitle}
                        onPress={() => handleDeclineFriendRequest()}

                    />
                </View>
                : <View style={styles.btnContainer}>
                    <Button
                        title='Review'
                        buttonStyle={[styles.btnAccept, styles.btn]}
                        titleStyle={styles.btnTitle}
                        type='outline'
                        onPress={() => openBetReview()}
                    />
                </View>
            }
            <Text style={styles.date}>{timeSince} ago</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        padding: 5,
        height: 120,
        backgroundColor: 'white',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark
    },
    btnContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    dismiss: {
        justifyContent: 'center'
    },
    titleContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontWeight: 'bold',
        marginTop: -15,
        marginLeft: 3
    },
    description: {
        marginTop: 5
    },
    btnDecline: {
        backgroundColor: Colors.red,
    },
    btn: {
        padding: 7,
        margin: 5,
        width: 70
    },
    btnTitle: {
        fontSize: 12
    },
    date: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        color: 'gray',
        fontSize: 10
    }

});