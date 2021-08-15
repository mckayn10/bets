import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native'
import Colors from '../constants/colors'
import { Input, Button } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/actions/auth';
import { Feather } from '@expo/vector-icons';



export default function Profile_Screen(props) {
    const userData = useSelector(state => state.auth.userInfo)

    const [firstNameText, setFirstNameText] = useState('')
    const [lastNameText, setLastNameText] = useState('')
    const [emailText, setEmailText] = useState('')
    const [usernameText, setUsernameText] = useState('')
    const [count, setCount] = useState(0)

    useEffect(() => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)

    }, [userData.firstName, userData.lastName, userData.username, userData.email])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return (
                    <TouchableOpacity {...props}>
                        <Text
                            style={{ color: 'white', fontSize: 17, marginBottom: 3, padding: 5 }}
                            onPress={() => handleGoBack()}
                        > Back
                        </Text>
                    </TouchableOpacity>
                )
            },
        })

    }, [props.navigation])

    const dispatch = useDispatch()

    const handleSave = () => {
        if (firstNameText === '' || lastNameText === '' || usernameText === '') {
            Alert.alert('Please fill out all text fields')
            return false
        }
        const user = {
            firstName: firstNameText,
            lastName: lastNameText,
            username: usernameText,
            email: emailText,
            infoId: userData.infoId,
            id: userData.id
        }

        try {
            dispatch(updateUser(user))
        }
        catch (err) {
            Alert.alert('Error updating profile. ' + err)
            console.error(err)
        }
    }

    const handleGoBack = () => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)
        props.navigation.goBack()
    }


    return (
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
            <View style={styles.screen}>
                <Image
                    source={require('../assets/profile-placeholder.png')}
                    style={{ width: 150, height: 150, margin: 10, opacity: .3 }}
                />
                <Input
                    label="first name"
                    defaultValue={userData.firstName}
                    onChangeText={firstNameText => setFirstNameText(firstNameText)}
                />
                <Input
                    label="last name"
                    defaultValue={userData.lastName}
                    onChangeText={(lastNameText) => setLastNameText(lastNameText)}
                />
                <Input
                    label="username"
                    defaultValue={userData.username}
                    onChangeText={(username) => setUsernameText(username)}
                />
                <Input
                    label="email (can't be changed)"
                    defaultValue={userData.email}
                    editable={false}

                />
                <Button
                    icon={
                        <Feather name="check-circle" size={24} color='white' />
                    }
                    iconRight
                    title="Save Changes  "
                    type="solid"
                    buttonStyle={styles.updateButton}
                    onPress={() => handleSave()}
                />


            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        padding: 15,
    },
    updateButton: {
        backgroundColor: Colors.primaryColor,
        width: '100%'
    },
})