import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function FriendCard(props) {
    const {firstName, lastName, email, username} = props.person

    return (
        <TouchableOpacity
            style={styles.container}
        >
            <View style={styles.descriptionContainer}>
                <View style={styles.personContainer}>
                    <Ionicons name="person-circle-outline" size={50} color="black" />
                </View>
                <View>
                    <Text style={styles.name}>{firstName} {lastName}</Text>
                    <Text style={styles.username}>{username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        height: 80,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#d9d9d9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    personContainer: {
        margin: 5
    },
    name: {
        fontWeight: 'bold',
        paddingBottom: 5
    },
    username: {
        fontSize: 12
    }

});