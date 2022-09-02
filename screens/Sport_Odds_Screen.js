import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator
} from 'react-native'
import Colors from '../constants/colors'
import FriendCard from "../components/FriendCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {SearchBar} from "react-native-elements";
import {unJuiceLines} from "../utils/utils";
import {formatDate} from "../constants/utils";


function Sport_Odds_Screen(props) {

    const userId = useSelector(state => state.auth.userId)
    const [matchList, setMatchList] = useState([])
    const [initialList, setInitialList] = useState([])
    const [searchText, setSearchText] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'x-api-key': '17694fa2-25af-11ed-89ba-0ae9bc51dafd',
            }
        };
        let arr = []
        fetch(`https://jsonodds.com/api/odds/${props.route.params.name}?oddType=Game`, options)
            .then(response => response.json())
            .then(res => {
                for (const [key, value] of Object.entries(res)) {

                    arr.push(value)
                }
                setMatchList(arr)
                setIsLoading(false)
                setInitialList(arr)
            })
            .catch(err => console.error(err));
    }, [])

    const createSportsbookBet = (matchData) => {
        props.navigation.navigate('Create Sports Bet', {
            matchData: matchData
        })
    }

    const handleSearch = (text) => {
        setSearchText(text)
        const query = text.toLowerCase()

        if (!query) {
            setMatchList(initialList)
            return;
        }

        const data = initialList.filter(match => {
            const matchString = (match.AwayTeam + ' ' + match.HomeTeam).toLowerCase()
            return matchString.includes(query)
        })
        setMatchList(data)
    }

    const backgroundImg = () => {
        switch(props.route.params.name) {
            case 'ncaaf':
                return require('../assets/ncaaf.jpeg')
            case 'mlb':
                return require('../assets/mlb.jpeg')
            case 'nfl':
                return require('../assets/fb-bg.jpeg')
            case 'nba':
                return require('../assets/nba.jpeg')
            case 'nhl':
                return require('../assets/nhl.jpeg')
            case 'ncaab':
                return require('../assets/ncaab.jpeg')
        }
        return require('../assets/fb-bg.jpeg')
    }


    const renderSportsList = matchData => {
        let match = unJuiceLines(matchData.item)
        // ET timezone offset in hours.
        let date = new Date(match.MatchTime)
        var timezone = date.getTimezoneOffset() / 60;
        // Timezone offset in minutes + the desired offset in minutes, converted to ms.
        // This offset should be the same for ALL date calculations, so you should only need to calculate it once.
        var offset = (date.getTimezoneOffset() + (timezone)) * 60 * 1000;

        let finalTime = new Date(date.getTime() - offset);
        finalTime.setMinutes(finalTime.getMinutes() + 6)
        // let formattedDate = finalTime.getHours()
        let time = finalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        let index = time.indexOf('0')

        let formattedTime = index == 0 ? time.replace('0', '') : time
        let odds = match.Odds[0]
        return (
            // <ImageBackground source={require('../assets/fb-bg.jpeg')} resizeMode='cover' style={{marginBottom: 2}}>
            <View style={styles.itemContainer}>

                <View style={styles.row}>
                    <View style={styles.cellContainer}>
                        <Text numberOfLines={2} style={[styles.itemText, styles.rowTitle]}>{match.AwayTeam}</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text style={[styles.itemText, {fontSize: 13, paddingLeft: 8, fontWeight: 'bold'}]}>AT</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text numberOfLines={2} style={[styles.itemText, styles.rowTitle]}>{match.HomeTeam}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cellContainer}>
                        <Text style={styles.cellTitle}>Away Spread</Text>
                        <Text style={[styles.itemText, styles.oddsText]}>{parseFloat(odds.PointSpreadAway) > 0 ? '+' : ""}{odds.PointSpreadAway}</Text>
                    </View>
                    <View style={[styles.cellContainer]}>
                        <Text style={[styles.cellTitle]}>O/U Total Points</Text>
                        <Text style={[styles.itemText, styles.oddsText, {marginBottom: -10, marginTop: 2, fontSize: 25}]}>{odds.TotalNumber} {parseFloat(odds.OverLine) > 0 ? '+' : ""}</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text style={styles.cellTitle}>Home Spread</Text>
                        <Text style={[styles.itemText, styles.oddsText]}>{parseFloat(odds.PointSpreadHome) > 0 ? '+' : ""}{odds.PointSpreadHome}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cellContainer}>
                        <Text style={styles.cellTitle}>Away Moneyline</Text>
                        <Text style={[styles.itemText, styles.oddsText]}>{parseFloat(odds.MoneyLineAway) > 0 ? '+' : ""}{odds.MoneyLineAway}</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginBottom: 3}}>{finalTime.toLocaleDateString()}</Text>
                        <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>{formattedTime}</Text>
                    </View>
                    <View style={styles.cellContainer}>
                        <Text style={styles.cellTitle}>Home Moneyline</Text>
                        <Text style={[styles.itemText, styles.oddsText]}>{parseFloat(odds.MoneyLineHome) > 0 ? '+' : ""}{odds.MoneyLineHome}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => createSportsbookBet(match)} style={{backgroundColor: Colors.primaryColor, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: Colors.primaryColor, width: "60%", alignSelf: 'center',marginTop: 10, marginBottom: 19, borderRadius: 50}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Create Bet With Matchup</Text>
                </TouchableOpacity>

            </View>
            // </ImageBackground>

        );
    }

    return (

        <ImageBackground source={backgroundImg()} resizeMode={'cover'} style={styles.container} >
            {isLoading
                ?
                <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} >
                    <ActivityIndicator style={{ marginBottom: 12 }} color={'white'} />
                </View>
                :
                matchList.length > 0
                        ?
                        <SafeAreaView style={styles.container}>

                            <SearchBar
                                value={searchText}
                                placeholder='Search for matchups..'
                                onChangeText={(text) => handleSearch(text)}
                                inputContainerStyle={styles.searchBar}
                                containerStyle={{ backgroundColor: Colors.primaryColor }}
                                inputStyle={{ fontSize: 16 }}
                                lightTheme={true}
                            />
                            <FlatList
                                data={matchList}
                                renderItem={renderSportsList}
                                keyExtractor={(sport, index) => index.toString()}
                                key={sport =>sport.index}
                                style={styles.listContainer}
                            />
                        </SafeAreaView>
                        :
                        <View style={styles.container}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '60%', alignSelf: 'center'}} >
                                <Text style={{fontSize: 20, textAlign: 'center', color: 'white'}}>There are currently no odds for this sport</Text>
                            </View>
                        </View>

            }

        </ImageBackground>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",

    },
    listContainer: {
        marginTop: 10,
      margin: 2
    },
    itemContainer: {
        // padding: 5,
        width: "95%",
        alignSelf: 'center',
        backgroundColor: "rgba(234,234,234,0.96)",
        // alignItems: 'center',
        marginBottom: 7,
        minHeight: 150,
        borderRadius: 5

    },
    itemText: {
        fontSize: 14,
        color: Colors.primaryColor,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    cellContainer: {
      width: '33%',
      alignItems: 'center',
    },
    cellTitle: {
      fontSize: 10,
        padding: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
        paddingLeft: 8,
        paddingTop: 8,
        paddingBottom: 8
    },
    rowTitle: {
        fontWeight: 'bold',
        fontSize: 17,

    },
    oddsText: {
        textAlign: 'center',
        color: '#06a60e',
        fontSize: 20
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

export default Sport_Odds_Screen;