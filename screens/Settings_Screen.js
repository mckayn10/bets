import React from 'react';
import {StyleSheet, View, SafeAreaView, TouchableOpacity, Text, Alert} from 'react-native';
import { logout, deleteAccount } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';
import HeaderText from '../components/HeaderText';
import Colors from '../constants/colors';
import {MaterialCommunityIcons, SimpleLineIcons} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';


export default function Settings_Screen(props) {

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(removeData())
    }

    const handleDelete = () => {
        dispatch(deleteAccount())
        dispatch(logout())
        dispatch(removeData())
    }

    const handleMyProfile = () => {
        props.navigation.navigate('User Profile')
    }

    const showConfirmDialog = () => {
        return Alert.alert(
            "You will lose all of your saved data including all stats and bet data. Are you sure you want to delete your account?",
            "",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        handleDelete()
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            { <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => handleMyProfile()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account" size={20} color="black" />
                        <Text style={[styles.name]}>My Profile</Text>
                    </View>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity> }
            {/* <TouchableOpacity
                style={styles.cardContainer}
            // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="settings-display" size={20} color="black" />
                        <Text style={[styles.name]}>Display Settings</Text>
                    </View>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
                style={styles.cardContainer}
            // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="help-outline" size={20} color="black" />
                        <Text style={[styles.name]}>Help</Text>
                    </View>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity> */}
            { <TouchableOpacity
                style={styles.cardContainer}
            // onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="feedback" size={20} color="black" />
                        <Text style={[styles.name]}>Submit Feedback</Text>
                    </View>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />

                </View>
            </TouchableOpacity> }
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => handleLogout()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="logout" size={20} color={Colors.red} />
                        <Text style={[styles.name, { color: Colors.red }]}>Logout</Text>
                    </View>
                    <SimpleLineIcons name="arrow-right" size={16} color="black" style={styles.arrow} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => showConfirmDialog()}
            >
                <View style={styles.descriptionContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="delete" size={20} color={Colors.red} />
                        <Text style={[styles.name, { color: Colors.red }]}>Delete Account</Text>
                    </View>
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
        fontWeight: 'bold',
        marginLeft: 10
    }

});