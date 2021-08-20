import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors';

export default MySearchableDropdown = (props) => {
    const friendsList = useSelector(state => state.people.friends)

    friendsList.forEach(friend => {
        friend.name = friend.firstName + ' ' + friend.lastName
    })

    return (
            <SearchableDropdown
                onTextChange={text => console.log(text)}
                onItemSelect={item => props.setUser(item)}
                containerStyle={{ padding: 15}}
                textInputStyle={{
                    padding: 15,
                    borderWidth: 1,
                    borderColor: Colors.grayLight,
                    backgroundColor: Colors.backgroundColor,
                    borderRadius: 5,
                }}
                itemStyle={{
                    paddingTop: 20,
                    paddingBottom: 20,
                    padding: 10,
                    backgroundColor: 'white',
                    borderColor: Colors.grayLight,
                    borderBottomWidth: 1,
                    backgroundColor: 'white',

                }}
                itemTextStyle={{
                    fontSize: 16,
                }}
                itemsContainerStyle={{
                    maxHeight: '100%',
                    position: 'absolute',
                    top: 72,
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: Colors.grayDark,
                    backgroundColor: 'white',


                }}
                items={friendsList}
                placeholder="Search friends..."
                placeholderTextColor='gray'

            />
    );
}