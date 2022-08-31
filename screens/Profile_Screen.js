import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native'
import Colors from '../constants/colors'
import { Input, Button } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateUser, validateUserName } from '../store/actions/auth';
import { Feather } from '@expo/vector-icons';
import UploadImage from '../components/UploadImage';
import { getProfilePic } from '../store/actions/auth';
import { storage } from '../firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';



export default function Profile_Screen(props) {
    const userData = useSelector(state => state.auth.userInfo)

    const [firstNameText, setFirstNameText] = useState('')
    const [lastNameText, setLastNameText] = useState('')
    const [emailText, setEmailText] = useState('')
    const [usernameText, setUsernameText] = useState('')
    const [venmoIdText, setVenmoIdText] = useState('')
    const [image, setImage] = useState('')
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)
        setVenmoIdText(userData.venmo_id)
    }, [])

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

    const upload = async () => {
        setSpinner(true)
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image.uri, true);
            xhr.send(null);
        });

        storage.child(`profile_pictures/${userData.email}-profile-picture`).put(blob, {
            contentType: blob.type
        })
            .then((snapshot) => {
                let url = userData.picture
                getProfilePic(userData.email).then(url => {
                    const user = {
                        firstName: firstNameText,
                        lastName: lastNameText,
                        username: usernameText,
                        email: emailText,
                        picture: url,
                        venmo_id: venmoIdText
                    }

                    try {
                        dispatch(updateUser(user))

                    }
                    catch (err) {
                        Alert.alert('Error updating profile. ' + err)
                        console.error(err)
                    }
                    setSpinner(false)
                    handleGoBack()
                })
            })
    }

    const handleSave = async () => {

        if (firstNameText === '' || lastNameText === '' || usernameText === '') {
            Alert.alert('Please fill out all text fields')
            return false
        }

        if (usernameText !== userData.username) {
            let newUsernameIsValid = await validateUserName(usernameText).then(res => {
                return res
            })
            if (!newUsernameIsValid) {
                Alert.alert(`The username ${usernameText} is already taken.`)
                return false
            }
        }

        if (image) {
            upload()
        } else {
            let venmoId = venmoIdText.replace('@','')
            const user = {
                firstName: firstNameText,
                lastName: lastNameText,
                username: usernameText,
                email: emailText,
                picture: userData.picture,
                venmo_id: venmoId
            }
            dispatch(updateUser(user))
            handleGoBack()
        }

    }

    const handleGoBack = () => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)
        setVenmoIdText(userData.venmo_id)
        props.navigation.goBack()
    }


    return (
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
            <Spinner
                visible={spinner}
                textContent={'Saving User...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor='rgba(0, 0, 0, 0.5)'
            />
            <View style={styles.screen}>
                <UploadImage setImage={(image) => setImage(image)} />
                <Input
                    style={styles.inputText}
                    labelStyle={styles.labelText}
                    label="first name"
                    defaultValue={userData.firstName}
                    onChangeText={firstNameText => setFirstNameText(firstNameText)}
                />
                <Input
                    style={styles.inputText}
                    labelStyle={styles.labelText}
                    label="last name"
                    defaultValue={userData.lastName}
                    onChangeText={(lastNameText) => setLastNameText(lastNameText)}
                />
                <Input
                    style={styles.inputText}
                    labelStyle={styles.labelText}
                    label="username"
                    defaultValue={userData.username}
                    onChangeText={(username) => setUsernameText(username)}
                />
                <Input
                    style={styles.inputText}
                    labelStyle={styles.labelText}
                    label="Venmo Username (do NOT include '@')"
                    defaultValue={userData.venmo_id}
                    onChangeText={(venmoId) => setVenmoIdText(venmoId)}
                />
                <Input
                    style={styles.inputText}
                    labelStyle={styles.labelText}
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
    spinnerTextStyle: {
        color: 'white'
    },
    inputText: {
        fontSize: 14,
    },
    labelText: {
        fontSize: 12,
    }
})