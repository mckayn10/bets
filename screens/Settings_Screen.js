import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';
import HeaderText from '../components/HeaderText';
import Colors from '../constants/colors';
import { SimpleLineIcons } from '@expo/vector-icons';


export default function Settings_Screen() {

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(removeData())
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.cardContainer}
                // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <Text style={styles.name}>Setting 1</Text>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cardContainer}
                // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <Text style={styles.name}>Setting 2</Text>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cardContainer}
                // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <Text style={styles.name}>Setting 3</Text>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cardContainer}
                // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <Text style={styles.name}>Setting 4</Text>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.name, {color: Colors.red}]}>Logout</Text>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    },
    cardContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 15,
        height: 60
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    }

});