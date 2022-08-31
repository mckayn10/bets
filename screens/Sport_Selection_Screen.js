import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import FriendCard from "../components/FriendCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {BackgroundImage} from "react-native-elements/dist/config";



function Sports_Selection_Screen(props) {
    const [sportsList, setSportsList] = useState([])


    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': '17694fa2-25af-11ed-89ba-0ae9bc51dafd',
            }
        };
        let arr = []
        let supported = ['nfl', 'ncaab', 'mlb', 'nba', 'ncaaf', 'nhl']
        fetch('https://jsonodds.com/api/sports', options)
            .then(response => response.json())
            .then(res => {
                for (const [key, value] of Object.entries(res)) {
                    if(supported.find(val => val === value)){
                        arr.push({name: value})
                    }
                }
                setSportsList(arr)
            })
            .catch(err => console.error(err));
    }, [])

    const viewSportOdds = (sport) =>{
        props.navigation.navigate('Matches', {
            sport: sport,
            name: sport.name
        })
    }

    const renderSportsList = sport => {
        return (
            // <BackgroundImage source={require('../assets/nba.jpeg')} resizeMode={'cover'} style={{marginBottom: 5}}>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => viewSportOdds(sport.item)}>
                        <Text style={{fontWeight: 'bold', fontSize: 30, color: 'white'}}>{sport.item.name.toUpperCase()}</Text>
                    </TouchableOpacity>
            // </BackgroundImage>

        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {sportsList.length > 0
                ?
                <FlatList
                    data={sportsList}
                    renderItem={renderSportsList}
                    keyExtractor={(sport, index) => index.toString()}
                    key={sport =>sport.index}
                    style={styles.listContainer}
                    numColumns={1}
                />
                :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '60%', alignSelf: 'center'}} >
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Sportsbook Lines are not available at this time</Text>
                </View>
            }

        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundColor,
        margin: 3,
    },
    listContainer: {
    },
    itemContainer: {
        height: 150,
        width: "100%",
        backgroundColor: "rgb(32,32,42)",
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 3,
        marginBottom: 3

    }
})

export default Sports_Selection_Screen;