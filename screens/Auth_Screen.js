import React, { Component, useState } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, View, TextInput, TouchableOpacity, Button } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch } from 'react-redux'
import { signIn } from '../store/actions/auth'


const Auth_Screen = () => {
    const [emailText, setUsernameText] = useState('');
    const [passwordText, setPasswordText] = useState('');

    const dispatch = useDispatch()
    
    const handleSignIn = () => {
        console.log(emailText, passwordText)

        dispatch(signIn(emailText, passwordText))

    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>mybetz.</Text>
            <TextInput
                style={styles.textInput}
                placeholder="email address"
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                onChangeText={emailText => setUsernameText(emailText)}
                defaultValue={emailText}
                keyboardType='email-address'
            />
            <TextInput
                style={styles.textInput}
                placeholder="password"
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                onChangeText={passwordText => setPasswordText(passwordText)}
                defaultValue={passwordText}
                keyboardType='visible-password'
                secureTextEntry
            />
            <TouchableOpacity >
                <Text style={styles.signInBtn} onPress={() => handleSignIn()}>Sign in</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },
    pageTitle: {
        fontSize: 70,
        color: 'white',
        marginBottom: 50,
        // marginTop: 100
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
        borderWidth: 1,
        marginTop: 30,
        borderColor: 'white',
        borderRadius: 17,
        overflow: 'hidden'
    },
})

export default Auth_Screen;