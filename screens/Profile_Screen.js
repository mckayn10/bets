import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native'
import Colors from '../constants/colors'
import { Input, Button } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/actions/auth';
import { Feather } from '@expo/vector-icons';
import UploadImage from '../components/UploadImage';
import { getProfilePic } from '../store/actions/auth';
import { storage } from '../firebase/firestore';



export default function Profile_Screen(props) {
    const userData = useSelector(state => state.auth.userInfo)

    const [firstNameText, setFirstNameText] = useState('')
    const [lastNameText, setLastNameText] = useState('')
    const [emailText, setEmailText] = useState('')
    const [usernameText, setUsernameText] = useState('')
    const [image, setImage] = useState('')
    const [profileImage, setProfileImage] = useState()


    useEffect(() => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)
        setProfileImage(userData.picture)

    }, [])

    const getImg = () => {
        return profileImage
    }

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
                console.log('successfully uploaded file')
            })
    }

    const handleSave = async () => {
        upload()

        if (firstNameText === '' || lastNameText === '' || usernameText === '') {
            Alert.alert('Please fill out all text fields')
            return false
        }

        getProfilePic(userData.email).then(url => {
            setProfileImage(url)
            const user = {
                firstName: firstNameText,
                lastName: lastNameText,
                username: usernameText,
                email: emailText,
                picture: profileImage
            }
        
            try {
                dispatch(updateUser(user))
    
            }
            catch (err) {
                Alert.alert('Error updating profile. ' + err)
                console.error(err)
            }
            handleGoBack()
        })
        
    }

    const handleGoBack = () => {
        setFirstNameText(userData.firstName)
        setLastNameText(userData.lastName)
        setUsernameText(userData.username)
        setEmailText(userData.email)
        setProfileImage(userData.picture)
        props.navigation.goBack()
    }


    return (
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
            <View style={styles.screen}>
                <UploadImage setImage={(image) => setImage(image)} />
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