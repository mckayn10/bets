import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function FriendCard(props) {
    const { firstName, lastName, email, username, id } = props.person
    const user = useSelector(state => state.auth.userInfo)
    const isUser = user.id === props.person.id

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => props.navigation.navigate('Person',
                {
                    person: props.person,
                    isUser: isUser
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
            <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        width: '100%',
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
    arrow: {
        position: 'absolute',
        right: 10
    }

});