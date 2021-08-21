import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useSelector } from 'react-redux';
import Colors from '../constants/colors';

export default MySearchableDropdown = (props) => {
    const friendsList = useSelector(state => state.people.friends)

    return (
            <SearchableDropdown
                onTextChange={text => text}
                onItemSelect={item => props.setUser(item)}
                containerStyle={{ padding: 10}}
                textInputStyle={{
                    fontSize: 13
                }}
                itemStyle={{
                    paddingTop: 17,
                    paddingBottom: 17,
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
                    top: 67,
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: Colors.grayDark,
                    backgroundColor: 'white',


                }}
                items={friendsList}
                placeholder="Search for a friend to send them a bet.."
                placeholderTextColor='gray'

            />
    );
}