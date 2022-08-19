import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';


function Friends_Screen(props) {
    let friendsList = useSelector(state => state.people.friends)

    const [searchText, setSearchText] = useState()
    const [friends, setFriends] = useState([])


    useEffect(() => {
        if (props.route.params) {
            setFriends(props.route.params.personsFriends)
        } else {
            setFriends(friendsList)
        }
        return () => {
            friendsList = []
        }
    }, [friendsList])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: props.route.params ? props.route.params.title : 'My Friends',
            headerRight: () => {
                return (
                    <TouchableOpacity {...props}>
                        <MaterialIcons
                            name="person-add-alt-1"
                            size={28} color="black"
                            style={{ color: 'white', marginBottom: 3, padding: 0 }}
                            onPress={() => props.navigation.navigate('Add Friends')}
                        />
                    </TouchableOpacity>
                )
            },
        })

    }, [props.navigation])

    const handleSearch = (text) => {
        setSearchText(text)
        const query = text.toLowerCase()

        if (!query) {
            setFriends(friendsList)
            return;
        }

        const data = friendsList.filter(user => {
            const userString = (user.firstName + ' ' + user.lastName + ' ' + user.username).toLowerCase()

            return userString.includes(query)
        })

        setFriends(data)
    }

    const renderFriendsList = friend => {
        return (
            <FriendCard person={friend.item} {...props} />
        );
    }

    return (
        <View style={styles.container}>
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
                    <Text style={styles.emptyText}>No friends were found</Text>
                    <Entypo name="emoji-sad" size={120} color={Colors.grayDark} style={styles.icon} />
                </View>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    emptyContainer: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center'
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
        color: 'black',
    },
    searchBar: {
        borderColor: 'white',
        borderRadius: 20,
        margin: 5,
        padding: 10,
        height: 40,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        backgroundColor: Colors.grayLight
    }
})

export default Friends_Screen;