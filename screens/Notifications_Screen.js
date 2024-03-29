import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, TouchableOpacity, Text, FlatList, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderText from '../components/HeaderText';
import colors from '../constants/colors';
import NotificationCard from '../components/NotificationCard';
import Colors from '../constants/colors'
import { markAsSeen } from '../store/actions/notifications';

export default function Notifications_Screen(props) {
    const [notifications, setNotifications] = useState()
    const isFocused = useIsFocused()

    const notis = useSelector(state => state.notifications.notifications)

    if (isFocused) {
        setTimeout(() => {
            notis.forEach(noti => {
                if (!noti.seen) {
                    markAsSeen(noti)
                }
            })
        }, 1000)

    }

    useEffect(() => {
        sortedNotis()
        return () => {
            setNotifications('')
        }
    }, [notis])


    const sortedNotis = () => {
        let sorted = notis
        sorted.sort(function (x, y) {
            return y.date - x.date
          })
    
        setNotifications(sorted)
    }

    const renderCompletedBet = noti => {
        return (
            <NotificationCard
                {...props}
                noti={noti.item}
            />
        );
    }

    return (
        <SafeAreaView style={styles.screen}>

            {notis.length > 0
                ? <FlatList
                    data={notifications}
                    renderItem={renderCompletedBet}
                    keyExtractor={(bet, index) => index.toString()}
                />
                : <View style={{ justifyContent: 'center', flex: 1 }}>
                    <HeaderText style={styles.emptyTextHeader}>No Notifications</HeaderText>
                    <HeaderText style={styles.emptyText}>We'll notify you of anything important here!</HeaderText>
                </View>
            }
        </SafeAreaView>


    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.backgroundColor
    },
    emptyTextHeader: {
        fontSize: 30,
        color: colors.grayDark,
        textAlign: 'center'
    },
    emptyText: {
        color: colors.grayDark,
        fontSize: 14,
        textAlign: 'center',
        padding: 10
    }

})