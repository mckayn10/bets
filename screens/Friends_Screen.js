import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import {fetchAllPeople} from "../store/actions/friends";


function Friends_Screen(props) {
    const dispatch = useDispatch();
    const userFriends = useSelector(state => state.people.friends)
    const userId = useSelector(state => state.auth.userId)
    let friendsList = useSelector(state => state.people.friends)

    const [searchText, setSearchText] = useState()
    const [friends, setFriends] = useState([])
    const [people, setPeople] = useState([])

    const allPeople = useSelector(state => state.people.people)
    const blockedBy = useSelector(state => state.people.blockedBy)

    useEffect(() => {
        try {
            dispatch(fetchAllPeople())
        }
        catch (err){
            console.error(err)
        }
    }, [])

    useEffect(() => {
        if (props.route.params) {
            setFriends(props.route.params.personsFriends)
            setPeople(props.route.params.personsFriends)
        } else {
            setFriends(friendsList)
            setPeople(friendsList)
        }
        return () => {
            friendsList = []
        }
    }, [friendsList, props.route.params, allPeople])

    const checkIfBlockedByUser = (id) => {
        var found = blockedBy.find(user => user.id === id);
        if(found){
            return true
        }
        return false
    }

    const handleSearch = (text) => {
        setSearchText(text)
        const query = text.toLowerCase()

        if (!query) {
            setPeople(friends)
            return;
        }

        let arrayToSearch = props.route.params ? friendsList : allPeople
        const data = arrayToSearch.filter(user => {
            let isBlocked = checkIfBlockedByUser(user.id)
            if(!isBlocked){
                const userString = (user.firstName + ' ' + user.lastName + ' ' + user.username).toLowerCase()
                if (userFriends.some(person => person.id == user.id)) {
                    user.isFriend = true
                }
                return userString.includes(query)
            }
        })

        data.sort(function (x, y) {
            return x.isFriend - y.isFriend;
        })
        setPeople(data)
    }

    const renderFriendsList = friend => {
        if(friend.id === userId){
            return
        } else {
            return (
                <FriendCard person={friend.item} {...props} />
            );
        }
    }

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchText}
                placeholder='Search for people..'
                onChangeText={(text) => handleSearch(text)}
                inputContainerStyle={styles.searchBar}
                containerStyle={{ backgroundColor: Colors.backgroundColor }}
                inputStyle={{ fontSize: 16 }}
                lightTheme={true}
            />
            {friends.length > 0
                ? <FlatList
                    data={people}
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