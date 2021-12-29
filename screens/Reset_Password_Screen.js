import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from '../constants/colors'
import HeaderText from '../components/HeaderText'
import { forgotPassword } from '../firebase/firestore'

function Reset_Password_Screen(props) {
    const [email, setEmail] = useState('')

    const sendEmail = () => {
        forgotPassword(email)
    }

    return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <HeaderText style={styles.pageTitle}>mybetz.</HeaderText >

            <Text style={styles.instruction}>Enter the email address associated with your account and we will send you an email with a link to reset your password.</Text>
            <TextInput
                style={styles.textInput}
                placeholder="email address"
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                onChangeText={email => setEmail(email)}
                defaultValue={email}
            />
            <TouchableOpacity >
                <Text
                    style={styles.resetPasswordBtn}
                    onPress={() => forgotPassword(email)}
                >
                    Reset Password
                </Text>
            </TouchableOpacity>
            <Text style={styles.backText} onPress={() => props.goBack(false)}>Back to Sign In</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    textInput: {
        color: 'white',
        width: '60%',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        textAlign: 'center',
        marginBottom: 20,
        paddingBottom: 5
    },
    resetPasswordBtn: {
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
    instruction: {
        color: 'white',
        display: 'flex',
        width: '95%',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30
    },
    pageTitle: {
        fontSize: 70,
        marginBottom: 50,
        color: 'white'
    },
    backText: {
        color: 'white',
        marginTop: 30,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: 'white'
    },
})

export default Reset_Password_Screen