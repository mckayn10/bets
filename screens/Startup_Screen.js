import React, {useEffect} from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/colors'
import { authenticate } from '../store/actions/auth';
import { useDispatch } from 'react-redux';

export default Startup_Screen = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if(!userData){
                props.navigation.navigate('Auth')
                return;
            }
            const transformedData = JSON.parse(userData)
            const {token, userId, expiryDate} = transformedData
            const expirationDate = new Date(expiryDate)

            if(expirationDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth')
                return;
            }

            props.navigation.navigate('Home')
            dispatch(authenticate(userId, token))
        }

        tryLogin()
    }, [dispatch])

    return (
        <View style={styles.screen}>
            <Text>Loading account...</Text>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center'
    }
})