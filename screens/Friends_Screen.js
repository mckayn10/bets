import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import { MaterialIcons } from '@expo/vector-icons';
import dummyFriends from '../data/dummyFriends'
import { Entypo } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';
import { SearchBar } from 'react-native-elements';


function Friends_Screen(props) {
    const [searchText, setSearchText] = useState()
    const [friends, setFriends] = useState(dummyFriends)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return (
                    <TouchableOpacity {...props}>
                        <Text
                            style={{ color: 'white', fontSize: 17, marginBottom: 3, padding: 5 }}
                            onPress={() => props.navigation.goBack()}
                        > Back
                        </Text>
                    </TouchableOpacity>
                )
            },
        })

    }, [props.navigation])

    const handleSearch = (text) => {
        setSearchText(text)
        const query = text.toLowerCase()

        const data = dummyFriends.filter(user => {
            const userString = (user.firstName + ' ' + user.lastName + ' ' + user.username).toLowerCase()

            return userString.includes(query)
        })

        setFriends(data)
    }

    const renderFriendsList = friend => {
        return (
            <FriendCard person={friend.item} />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                value={searchText}
                placeholder='Search friends..'
                onChangeText={(text) => handleSearch(text)}
                inputContainerStyle={styles.searchBar}
                containerStyle={{ backgroundColor: Colors.backgroundColor }}
                inputStyle={{ fontSize: 16 }}
                lightTheme={true}

            />
            {friends.length > 0
                ? <FlatList
                    data={friends}
                    renderItem={renderFriendsList}
                    keyExtractor={(friend, index) => index.toString()}
                />
                : <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You have no friends</Text>
                    <Entypo name="emoji-sad" size={120} color={Colors.accentColor} style={styles.icon} />
                </View>
            }
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        padding: 5,
        opacity: .3
    },
    icon: {
        alignSelf: 'center'
    },
    friendRow: {
        padding: 15,
        borderTopWidth: 5,
        borderTopColor: 'red',
        color: 'black',
    },
    searchBar: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 20,
        margin: 5,
        padding: 10,
        height: 40,
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
    }
})

export default Friends_Screen;