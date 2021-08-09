import React, { Component, useState } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View, TextInput, TouchableOpacity, Button } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch } from 'react-redux'
import { signUp } from '../store/actions/auth'

const Register_Screen = () => {
    const [emailText, setUsernameText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [firstNameText, setFirstNameText] = useState('');
    const [lastNameText, setLastNameText] = useState('');

    const dispatch = useDispatch()
    
    const handleRegister = () => {
        console.log(emailText, passwordText, firstNameText, lastNameText)

        dispatch(signUp(emailText, passwordText))

    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>mybetz.</Text>
            <TextInput
                style={styles.textInput}
                placeholder="first name"
                placeholderTextColor='rgba(255, 255, 255, 0.8)'
                onChangeText={firstNameText => setFirstNameText(firstNameText)}
                defaultValue={firstNameText}
            />
            <TextInput
                style={styles.textInput}
                placeholder="last name"
                placeholderTextColor='rgba(255, 255, 255, 0.8)'
                onChangeText={lastNameText => setLastNameText(lastNameText)}
                defaultValue={lastNameText}
            />
            <TextInput
                style={styles.textInput}
                placeholder="email address"
                placeholderTextColor='rgba(255, 255, 255, 0.8)'
                onChangeText={emailText => setUsernameText(emailText)}
                defaultValue={emailText}
                keyboardType='email-address'

            />
            <TextInput
                style={styles.textInput}
                placeholder="password"
                placeholderTextColor='rgba(255, 255, 255, 0.8)'
                onChangeText={passwordText => setPasswordText(passwordText)}
                defaultValue={passwordText}
                secureTextEntry

            />
            <TouchableOpacity >
                <Text style={styles.signInBtn} onPress={() => handleRegister()}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.primaryColor
    },
    pageTitle: {
        fontSize: 70,
        color: 'white',
        marginBottom: 50,
        marginTop: 100
    },
    textInput: {
        color: 'white',
        width: '60%',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        textAlign: 'center',
        marginBottom: 20,
        paddingBottom: 5
    },
    signInBtn: {
        color: Colors.primaryColor,
        backgroundColor: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        paddingRight: 50,
        paddingLeft: 50,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 17,
        overflow: 'hidden'
    },
})

export default Register_Screen;