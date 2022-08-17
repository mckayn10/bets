import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { formatTimeSince } from '../constants/utils';
import { addFriend } from '../store/actions/friends';
import { useDispatch } from 'react-redux';
import { deleteNotification } from '../store/actions/notifications';
import { sendFriendRequestAccepted } from '../store/actions/notifications';

export default function NotificationCard(props) {

    const { to, from, data, type, date, id, pendingAction, seen } = props.noti
    var aDay = 24 * 60 * 60 * 1000;
    let timeSince = formatTimeSince(new Date(date - aDay))
    let user = to
    let person = from
    let parsedDate = new Date(date)


    const dispatch = useDispatch()

    const handleDeclineFriendRequest = () => {
        dismissNotification()
    }

    const handleAcceptFriendRequest = () => {
        try {
            dispatch(addFriend(from))
        }
        catch (err) {
            console.error(err)
        }
        let notificationType = 'friendAccept'
        sendFriendRequestAccepted(user, person, notificationType)
        dismissNotification()
    }

    const dismissNotification = () => {
        deleteNotification(id)
    }

    const openBetReview = () => {
        let notiData = { notiId: id, pendingAction: pendingAction, from: from, to: to, type: type }

        props.navigation.navigate('Bet Review', { betData: data, notiData: notiData })
    }

    const openPersonProfile = () => {
        props.navigation.push('Person', {
            person: person,
            isUser: false
        })
    }

    const notificationCreator = () => {
        let notiPackage = {}
        switch (type) {
            case 'friendRequest':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Accept'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            onPress={() => handleAcceptFriendRequest()}

                        />
                        <Button
                            title='Decline'
                            buttonStyle={[styles.btnDecline, styles.btn]}
                            titleStyle={styles.btnTitle}
                            onPress={() => handleDeclineFriendRequest()}
                        />
                    </View>
                notiPackage.betDescription = ''
                notiPackage.message = " has sent you a friend request"
                return notiPackage

            case 'friendAccept':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='View Profile'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openPersonProfile()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = ''
                notiPackage.message = " has accepted your friend request"
                return notiPackage

            case 'betRequest':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has sent you a bet offer:"
                return notiPackage

            case 'betAccept':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has accepted your bet offer:"
                return notiPackage

            case 'betDecline':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has declined your bet offer:"
                return notiPackage

            case 'betUpdateDecline':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>

                notiPackage.betDescription = data.description
                notiPackage.message = " has declined the proposed updates for your bet:"
                return notiPackage

            case 'betUpdateAccept':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has accepted the proposed updates for your bet:"
                return notiPackage

            case 'betUpdate':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has proposed an update to your bet:"
                return notiPackage

            case 'betDelete':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has proposed to delete your bet:"
                return notiPackage

            case 'betDeleteAccept':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has agreed to delete your bet:"
                return notiPackage

            case 'betDeleteDecline':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Review'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            type='outline'
                            onPress={() => openBetReview()}
                        />
                        <Button
                            title='Dismiss'
                            buttonStyle={[styles.btnDismiss, styles.btn]}
                            titleStyle={[styles.btnTitle, { color: Colors.red }]}
                            type='outline'
                            onPress={() => dismissNotification()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has declined to delete your bet:"
                return notiPackage

            case 'doubleOrNothing':
                notiPackage.btns =
                    <View style={styles.btnContainer}>
                        <Button
                            title='Accept'
                            buttonStyle={[styles.btnAccept, styles.btn]}
                            titleStyle={styles.btnTitle}
                            onPress={() => handleAcceptFriendRequest()}

                        />
                        <Button
                            title='Decline'
                            buttonStyle={[styles.btnDecline, styles.btn]}
                            titleStyle={styles.btnTitle}
                            onPress={() => handleDeclineFriendRequest()}
                        />
                    </View>
                notiPackage.betDescription = data.description
                notiPackage.message = " has offered to go double or nothing on your bet:"
                return notiPackage
        }
    }


    return (
        <View style={[styles.container, seen ? '' : styles.unseenContainer]}>
            <View style={styles.titleContainer}>
                <Ionicons name="ios-person-circle-outline" size={60} color="black" />
                <View style={{ width: '100%', flexWrap: 'wrap' }}>
                    <Text style={styles.title}>
                        {from.firstName}
                        <Text style={{ fontWeight: '300' }}>{notificationCreator().message}</Text>
                    </Text>
                    <Text numberOfLines={1} style={styles.description}>{notificationCreator().betDescription}</Text>
                </View>
            </View>
            {notificationCreator().btns}
            <Text style={styles.date}>{parsedDate.toLocaleString()}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        padding: 5,
        height: 120,
        backgroundColor: 'white',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDark
    },
    unseenContainer: {
        backgroundColor: 'rgba(238, 240, 255, 1)'
    },
    btnContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    dismiss: {
        justifyContent: 'center'
    },
    titleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 3,
        width: '80%',
        flexWrap: 'wrap',
        marginTop: 10

    },
    description: {
        marginTop: 5,
        marginLeft: 2,
        width: "80%"

    },
    btnDecline: {
        backgroundColor: Colors.red,
    },
    btnDismiss: {
        borderColor: Colors.red
    },
    btn: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 7,
        paddingBottom: 7,
        margin: 5,
    },
    btnTitle: {
        fontSize: 12
    },
    date: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        color: 'gray',
        fontSize: 10
    }

});