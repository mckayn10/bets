import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationCard(props) {
    const { to, from, message, data, type, date } = props.noti

    const openNotification = () => {
        console.log('open')
    }
    const closeNotification = () => {
        console.log('close')
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name="ios-person-circle-outline" size={50} color="black" />
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

                    />
                    <Button
                        title='Decline'
                        buttonStyle={[styles.btnDecline, styles.btn]}
                        titleStyle={styles.btnTitle}
                    />
                </View>
                : <View style={styles.btnContainer}>
                    <Button
                        title='Review'
                        buttonStyle={[styles.btnAccept, styles.btn]}
                        titleStyle={styles.btnTitle}
                        type='outline'
                    />
                </View>
            }
            <Text style={styles.date}>{date}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        padding: 5,
        marginTop: 5,
        height: 120,
        backgroundColor: Colors.backgroundColor,
        width: '100%',
        shadowColor: '#d9d9d9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        borderRadius: 15
    },
    btnContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    dismiss: {
        justifyContent: 'center'
    },
    titleContainer: {
        // padding: 5,
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
        bottom: 10,
        left: 15,
        color: 'gray',
        fontSize: 10
    }

});