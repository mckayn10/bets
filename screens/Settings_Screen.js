import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { logout } from '../store/actions/auth';
import { removeData } from '../store/actions/bets';
import { useDispatch } from 'react-redux';
import HeaderText from '../components/HeaderText';

export default function Settings_Screen() {

    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(logout())
        dispatch(removeData())
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderText>Settings Screen</HeaderText>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});