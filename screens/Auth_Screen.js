import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import {CheckBox} from "react-native-elements";
import Colors from '../constants/colors'
import { useDispatch } from 'react-redux'
import { signIn, signUp } from '../store/actions/auth'
import { MaterialIcons } from '@expo/vector-icons';
import HeaderText from '../components/HeaderText'
import { placeholderPic } from '../constants/urls'
import Reset_Password_Screen from './Reset_Password_Screen'


function Auth_Screen(props) {
    const [emailText, setEmailText] = useState('');
    const [firstNameText, setFirstNameText] = useState('')
    const [lastNameText, setLastNameText] = useState('')
    const [passwordText, setPasswordText] = useState('');
    const [isSignIn, setIsSignIn] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [isSelected, setSelection] = useState(true)

    const dispatch = useDispatch()

    const handleAuthenticate = async () => {
        let action;

        if (isSignIn) {
            action = signIn(emailText, passwordText)
        } else {
            if(!isSelected){
                setError('You must agree to the Terms & Conditions before registering')
                return;
            }
            let userInfo = {
                email: emailText,
                password: passwordText,
                firstName: firstNameText,
                lastName: lastNameText,
                username: firstNameText + '_' + lastNameText + '_' + Math.floor(Math.random() * 10000),
                picture: placeholderPic
            }
            action = signUp(userInfo)

        }

        setError(null)
        setIsLoading(true)
        try {
            await dispatch(action)
        }
        catch (err) {
            setError(err.message)
            setIsLoading(false)
        }

    }

    return (
        <View style={styles.container}>
            {showResetPassword
                ? <Reset_Password_Screen goBack={(val) => setShowResetPassword(val)} />
                : <View style={styles.container}>
                    {error
                        ? <View style={styles.errorContainer}>
                            <MaterialIcons style={{ marginRight: 5 }} name="error-outline" size={17} color={Colors.red} />
                            <Text style={styles.error}>{error}</Text>
                        </View>
                        : null
                    }
                    <HeaderText style={styles.pageTitle}>mybetz.</HeaderText >
                    {isSignIn
                        ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="email address"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={emailText => setEmailText(emailText)}
                                defaultValue={emailText}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="password"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={passwordText => setPasswordText(passwordText)}
                                defaultValue={passwordText}
                                keyboardType='default'
                                autoCapitalize='none'
                                secureTextEntry={true}
                            />
                        </View>
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="first name"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={firstNameText => setFirstNameText(firstNameText)}
                                defaultValue={firstNameText}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="last name"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={lastNameText => setLastNameText(lastNameText)}
                                defaultValue={lastNameText}
                                secureTextEntry={false}

                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="email address"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={emailText => setEmailText(emailText)}
                                defaultValue={emailText}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="password"
                                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                                onChangeText={passwordText => setPasswordText(passwordText)}
                                defaultValue={passwordText}
                                keyboardType='default'
                                autoCapitalize='none'
                                secureTextEntry={true}
                            />
                            <Text
                                style={styles.termsAndConditions}
                                onPress={() => Linking.openURL('https://mybetz.site/privacy-policy')}
                            >
                                Terms & Conditions
                            </Text>
                            <CheckBox
                                title='I agree to the terms & conditions'
                                checked={isSelected}
                                containerStyle={styles.checkBoxContainer}
                                onPress={() => {setSelection(!isSelected)}}
                                uncheckedColor='white'
                            />
                        </View>
                    }
                    {isSignIn
                        ? <Text style={[styles.registerText, styles.createText, styles.forgotPassword]} onPress={() => setShowResetPassword(true)}>Forgot Password?</Text>
                        : null
                    }
                    {isLoading
                        ? <ActivityIndicator style={{ marginBottom: 12 }} />
                        : <TouchableOpacity >
                            <Text
                                style={styles.signInBtn}
                                onPress={() =>
                                    handleAuthenticate()}>
                                {isSignIn ? 'Sign In' : 'Register'}
                            </Text>
                        </TouchableOpacity>
                    }

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>{isSignIn ? 'Don\'t have an account?' : 'Already have an account?'}</Text>
                        <Text
                            style={[styles.registerText, styles.createText]}
                            onPress={() => setIsSignIn(!isSignIn)}
                        >
                            {isSignIn ? ' Register here.' : ' Sign in here'}
                        </Text >
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },
    pageTitle: {
        fontSize: 70,
        marginBottom: 50,
        color: 'white'
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
        overflow: 'hidden',
    },
    registerContainer: {
        // flexDirection: 'c',
        marginTop: 30,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerText: {
        color: 'white'
    },
    forgotPassword: {
    },
    createText: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: 'white'
    },
    error: {
        color: Colors.red,
        textAlign: 'center'
    },
    errorContainer: {
        padding: 7,
        width: '90%',
        borderRadius: 2,
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    termsAndConditions: {
        color: 'blue'
    },
    checkBoxContainer: {
        backgroundColor: Colors.primaryColor,
        borderWidth: 0
    }
})

export default Auth_Screen;