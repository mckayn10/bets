import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from '../constants/colors'
import { useDispatch } from 'react-redux'
import { signIn, signUp } from '../store/actions/auth'
import { MaterialIcons } from '@expo/vector-icons';
import HeaderText from '../components/HeaderText'


function Auth_Screen (props) {
    const [emailText, setUsernameText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [isSignIn, setIsSignIn] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()


    const dispatch = useDispatch()

    const handleAuthenticate = async () => {
        let action;

        if (isSignIn) {
            action = signIn(emailText, passwordText)
        } else {
            action = signUp(emailText, passwordText)
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
            {error
                ? <View style={styles.errorContainer}>
                    <MaterialIcons style={{ marginRight: 5 }} name="error-outline" size={17} color={Colors.red} />
                    <Text style={styles.error}>{error}</Text>
                </View>
                : null
            }
            <HeaderText style={styles.pageTitle}>mybetz.</HeaderText >
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
        alignItems: 'center',
        flexDirection: 'row'
    }
})

export default Auth_Screen;