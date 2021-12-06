import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { useDispatch } from 'react-redux';
import {storage} from '../firebase/firestore'
import { getUserPic } from '../store/actions/auth';
import { useSelector } from 'react-redux';

export default function UploadImage(props) {
    const [image, setImage] = useState();
    const pic = useSelector(state => state.auth.profPic)

    useEffect(() => {
        // checkForCameraRollPermission()
    }, []);

    useEffect(() => {
        setImage(pic)
    }, [pic]);



    const dispatch = useDispatch()

    const addImage = async () => {
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: .5,
        });

        if (!_image.cancelled) {
            setImage(_image.uri);
        }
        props.setImage(_image)
        dispatch(getUserPic())
    }

    const checkForCameraRollPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Please grant camera roll permissions inside your system's settings");
        } else {
            console.log('Media Permissions are granted')
        }

    }

    return (
        <View style={styles.container}>
            {
                image && <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
            }

            <View style={styles.uploadBtnContainer}>
                <TouchableOpacity onPress={() => { addImage() }} style={styles.uploadBtn} >
                    <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                    <AntDesign name="camera" size={20} color="black" />
                </TouchableOpacity>
            </View>


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        height: 150,
        width: 150,
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    uploadBtnContainer: {
        opacity: 0.7,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: '25%',
    },
    uploadBtn: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    }
})