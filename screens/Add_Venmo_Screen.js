import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, Pressable, View, Platform, Alert, ScrollView, SafeAreaView } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import { createBet } from '../store/actions/bets'
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Switch } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import MySearchableDropdown from '../components/SearchableDropdown';
import * as BadWords from 'badwords/array'
import {updateUser} from "../store/actions/auth";


const Add_Venmo_Screen = props => {

    const [venmoId, setVenmoId] = useState('')

    const userInfo = useSelector(state => state.auth.userInfo)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (

                    <TouchableOpacity {...props}>
                        <AntDesign
                            name="close"
                            size={22}
                            color="white"
                            // style={{ paddingBottom: 5 }}
                            onPress={() => closeModal()}
                        />
                    </TouchableOpacity>
                )
            }
        })
    }, [])

    const dispatch = useDispatch();

    function check_val(text) {
        var bad_words = BadWords['default']
        var error = 0;

        if (text.toLowerCase().split(' ').some(part => bad_words.includes(part))) {
            error = error + 1;
        }

        if (error > 0) {
            return false
        }
        else {
            return true
        }
    }

    const updateProfile = () => {

        if(!check_val(venmoId)){
            Alert.alert('Please remove any inappropriate or offensive language before creating this bet.')
            return false
        }

        const user = userInfo
        const newVenmoId = venmoId.replace('@','');
        user.venmo_id = newVenmoId

        try {
            dispatch(updateUser(user))
        }
        catch (err) {
            Alert.alert('Error saving venmo id. ' + err)
            console.error(err)
        }

        closeModal()

    }

    const closeModal = () => {
        setVenmoId('')
        props.navigation.goBack()

    }

    return (

        <View style={styles.container}>
            <View style={styles.pageDescription}>
                <Text style={styles.descriptionText}>To make settling your bets as easy as the tap of a button, please add your Venmo username below</Text>
            </View>
            <View style={styles.addUsernameContainer}>
                <View style={styles.inputContainer}>
                    <Input
                        style={styles.input}
                        placeholder='venmo username'
                        labelStyle={styles.inputLabel}
                        onChangeText={venmoId => setVenmoId(venmoId)}
                        defaultValue={venmoId}
                    />
                </View>
                <View style={styles.btnContainer}>
                    <Button
                        icon={
                            <Feather name="check-circle" size={24} color='white' />
                        }
                        iconRight
                        title="Save   "
                        type="solid"
                        buttonStyle={styles.createBtn}
                        onPress={() => updateProfile()}
                    />
                </View>
            </View>
        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    addUsernameContainer: {
        width: '100%',
        height: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '90%'
    },
    input: {
        marginTop: 3,
        fontSize: 25,
        textAlign: 'center'
    },
    inputLabel: {
        fontSize: 25
    },
    pageDescription: {
        padding: 20
    },
    descriptionText: {
        fontSize: 18,
        lineHeight: 30
    },
    closeIcon: {
        fontSize: 18,
        margin: 10,
        alignSelf: 'flex-end',
        color: 'white'
    },
    createBtn: {
        backgroundColor: Colors.venmoBlue
    },
    icon: {
        marginRight: 10
    },
    btnContainer: {

        alignSelf: 'center',
        width: '90%'

    }
})

export default Add_Venmo_Screen;