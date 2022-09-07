import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity, ActivityIndicator, Image} from 'react-native'
import Colors from '../constants/colors'
import HeaderText from "../components/HeaderText";
import FriendCard from "../components/FriendCard";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {BackgroundImage} from "react-native-elements/dist/config";



function Sports_Selection_Screen(props) {
    const [sportsList, setSportsList] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': 'd8d2dc3b-1450-4337-9fde-c47c96e9b98e',
            }
        };
        let arr = []
        let supported = ['nfl', 'ncaab', 'mlb', 'nba', 'ncaaf', 'nhl', 'mls']
        fetch('https://jsonodds.com/api/sports', options)
            .then(response => response.json())
            .then(res => {
                for (const [key, value] of Object.entries(res)) {
                    if(supported.find(val => val === value)){
                        arr.push({name: value})
                    }
                }
                setSportsList(arr)
                setIsLoading(false)
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
        let logo = null
        switch(sport.item.name){
            case "mlb":
                logo = <Image source={require('../assets/mlb-logo.png')} style={{height: 50, width: 50, marginLeft: 15}} />
                break;
            case "ncaab":
                logo = <Image source={require('../assets/ncaab-logo.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                break;
            case "nba":
                logo = <Image source={require('../assets/nba-logo.png')} style={{height: 50, width: 20, marginLeft: 15}} />
                break;
            case "ncaaf":
                logo = <Image source={require('../assets/ncaaf-logo.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                break;
            case "nfl":
                logo = <Image source={require('../assets/nfl-logo.png')} style={{height: 40, width: 40, marginLeft: 15, marginBottom: 5}} />
                break;
            case "nhl":
                logo = <Image source={require('../assets/nhl-logo.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                break;
        }
        return (
            // <BackgroundImage source={require('../assets/nba.jpeg')} resizeMode={'cover'} style={{marginBottom: 5}}>
                    <TouchableOpacity style={styles.itemContainer} onPress={() => viewSportOdds(sport.item)}>
                        <View style={styles.textLogoContainer}>
                            <HeaderText style={{fontWeight: 'bold', fontSize: 30, color: 'white'}}>{sport.item.name.toUpperCase()}</HeaderText>
                            {logo}
                        </View>
                    </TouchableOpacity>
            // </BackgroundImage>

        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading
                ?
                <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} >
                    <ActivityIndicator style={{ marginBottom: 12 }} color={'white'} />
                </View>
                :
                sportsList.length > 0
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
                            <Text style={{fontSize: 20, textAlign: 'center', color: 'white'}}>Sportsbook Odds are not available at this time</Text>
                        </View>
            }


        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
    },
    listContainer: {
        margin: 3,

    },
    textLogoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
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