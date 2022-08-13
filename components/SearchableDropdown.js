import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown'
import { useSelector } from 'react-redux';
import Colors from '../constants/colors';

const MySearchableDropdown = (props) => {
    let friendsList = useSelector(state => state.people.friends)
    let updatedFriends = []
    friendsList.forEach(friend => {
        friend.name = friend.firstName + ' ' + friend.lastName
        updatedFriends.push(friend)
    })


    return (
            <SearchableDropdown
                onTextChange={text => text}
                onItemSelect={item => props.setUser(item)}
                containerStyle={{
                    borderWidth: 1,
                    margin: 5,
                    borderRadius: 30,
                    borderColor: Colors.grayLight,
                    width: '95%',
                    alignSelf: 'center',

                }}
                textInputStyle={{
                    fontSize: 16,
                    padding: 12
                }}
                itemStyle={{
                    paddingTop: 17,
                    paddingBottom: 17,
                    padding: 10,
                    borderColor: Colors.grayLight,
                    borderBottomWidth: 1,
                    fontSize: 19,
                    color: 'black'
                }}
                itemTextStyle={{
                    fontSize: 19,
                }}
                itemsContainerStyle={{
                    maxHeight: 523,
                    position: 'absolute',
                    top: 50,
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: Colors.grayDark,
                    backgroundColor: 'white',
                }}
                items={updatedFriends}
                placeholder='Search for friends..'
                placeholderTextColor='lightgray'
                setSort={(item, searchedText)=> item.firstName.toLowerCase().startsWith(searchedText.toLowerCase())}

            />
    );
}
export default MySearchableDropdown