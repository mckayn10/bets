import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import { AntDesign } from '@expo/vector-icons';
import dummyFriends from '../data/dummyFriends'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FriendCard from '../components/FriendCard';
import { SearchBar } from 'react-native-elements';
import {fetchAllPeople} from '../store/actions/friends'
import { Ionicons } from '@expo/vector-icons';


function Friends_Screen(props) {
    const [searchText, setSearchText] = useState()
    const [people, setPeople] = useState([])

    const dispatch = useDispatch();

    useEffect(() => {
        try {
            dispatch(fetchAllPeople())
        }
        catch (err){
            console.error(err)
        }
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return (
                    <TouchableOpacity {...props}>
                        <Ionicons
                            name="backspace-outline"
                            size={24}
                            color="white"
                            style={{ marginBottom: 3, padding: 0 }}
                            onPress={() => props.navigation.goBack()}
                        />

                    </TouchableOpacity>
                )
            }
        })
    }, [])

    const allPeople = useSelector(state => state.people.people)

    const handleSearch = (text) => {
        setSearchText(text)
        const query = text.toLowerCase()

        if(!query){
            setPeople([])
            return;
        }


        const data = allPeople.filter(user => {
            const userString = (user.firstName + ' ' + user.lastName + ' ' + user.username).toLowerCase()

            return userString.includes(query)
        })

        setPeople(data)
    }

    const renderFriendsList = friend => {
        return (
            <FriendCard person={friend.item} {...props}/>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                value={searchText}
                placeholder='Search people..'
                onChangeText={(text) => handleSearch(text)}
                inputContainerStyle={styles.searchBar}
                containerStyle={{ backgroundColor: Colors.backgroundColor }}
                inputStyle={{ fontSize: 16 }}
                lightTheme={true}

            />
            {people.length > 0
                ? <FlatList
                    data={people}
                    renderItem={renderFriendsList}
                    keyExtractor={(friend, index) => index.toString()}
                />
                : <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results matching your search</Text>
                    <MaterialCommunityIcons name="account-search-outline" size={120} color={Colors.grayDark} style={styles.icon} />
                </View>
            }
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
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
        backgroundColor: Colors.grayLight,
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