import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function FriendCard(props) {
    const { firstName, lastName, email, username, id } = props.person

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => props.navigation.navigate('Person',
                {
                    person: props.person,
                    isUser: false
                }
            )
            }
        >
            <View style={styles.descriptionContainer}>
                <View style={styles.personContainer}>
                    <Ionicons name="person-circle-outline" size={48} color="black" />
                </View>
                <View>
                    <Text style={styles.name}>{firstName} {lastName}</Text>
                    <Text style={styles.username}>@{username}</Text>
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
        marginTop: 5,
        height: 70,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    personContainer: {
        margin: 5,
        opacity: .3
    },
    name: {
        fontWeight: 'bold',
        paddingBottom: 5
    },
    username: {
        fontSize: 12
    },
    friendStatus: {
        marginRight: 15,
        padding: 5
    }

});