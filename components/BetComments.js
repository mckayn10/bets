import React, { useState, useEffect, useCallback } from 'react'
import {
    StyleSheet,
    Platform,
    SafeAreaView,
    FlatList,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { Input, Button, Switch } from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux'
import Colors from '../constants/colors'

import BetCard from './BetCard'
import { MaterialIcons } from '@expo/vector-icons';
import {createBet, fetchBets, fetchFeedBets, addComment, fetchComments} from '../store/actions/bets';
import HeaderText from './HeaderText'
import Icon from "react-native-vector-icons/FontAwesome";
import {check_val, getBetComments} from "../utils/utils";
import keyboard from "react-native-web/dist/exports/Keyboard";
import CachedImage from "react-native-expo-cached-image";

function BetComments(props) {
    const { description, amount, other_bettor, date, won_bet, is_complete, id, is_open, date_complete, is_verified, is_accepted, creator_id, other_id, creator } = props.bet
    const [newCommentText, setNewCommentText] = useState('')
    const [commentsState, setCommentsState] = useState([])
    const dispatch = useDispatch()
    const comments = useSelector(state => state.bets.comments)


    const userId = useSelector(state => state.auth.userId)
    const user = useSelector(state => state.auth.userInfo)
    const otherPersonId = userId === creator_id ? other_id : creator_id
    const otherPerson = userId === creator_id ? other_bettor : creator

    useEffect(() =>{
        if(comments.length > 0){
            let betComments = getBetComments(id, comments)
            betComments.sort(function (x, y) {
                return x.date - y.date;
            })
            setCommentsState(betComments)
        }
    }, [comments])


    const openPersonProfile = (person) => {
        if(!person.id){
            return;
        }
        if(person.id === user.id){
            props.navigation.navigate('User Profile')
        }
        else {
            props.navigation.navigate('Person Profile', {
                person: person,
                isUser: false
            })
        }
    }
    const handleAddComment = () => {
        if(newCommentText == ''){
            Alert.alert('Please add a comment')
            return false
        }

        if(!check_val(newCommentText)){
            Alert.alert('Please remove any inappropriate or offensive language before creating this bet.')
            return false
        }

        let commentData = {
            commentor: user,
            creator: creator,
            other_bettor: other_bettor,
            description: newCommentText,
            date: Date.now(),
            bet_id: props.bet.id,
            bet: props.bet
        }

        try {
            dispatch(addComment(commentData))
        }
        catch (err) {
            Alert.alert('Error creating new bet. ' + err)
            console.error(err)
        }

        Keyboard.dismiss()
        setNewCommentText('')
    }

    const renderComment = comment => {
        let newComment = comment.item
        return (
            <View style={{flex: 1, padding: 5, margin: 5, width: '98%', alignSelf: 'center', flexDirection: 'row'}}>
                <CachedImage
                    style={styles.image}
                    source={{
                        uri: newComment.commentor.picture,
                        // headers: { Authorization: 'token' }
                    }}
                    onPress={() => openPersonProfile(newComment.commentor)}
                />
                <View style={{width: '100%',borderBottomWidth: 1, borderBottomColor: Colors.grayLight, paddingBottom: 5, flexWrap: 'wrap'}}>
                    <Text onPress={() => openPersonProfile(newComment.commentor)} style={{fontSize: 13, fontWeight: 'bold', paddingBottom: 5}}>{newComment.commentor.firstName} {newComment.commentor.lastName}</Text>
                    <Text style={styles.date}>{new Date(newComment.date).toLocaleString()}</Text>
                    <Text style={{marginTop: 10, fontSize: 13, width: '95%'}}>{newComment.description}</Text>
                </View>
            </View>
        );

    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={[styles.container]}
            keyboardVerticalOffset={100}
        >
            {commentsState.length > 0
                ?
                <SafeAreaView style={styles.listContainer}>
                    <FlatList
                        data={commentsState}
                        renderItem={renderComment}
                        keyExtractor={(comment, index) => index.toString()}
                    />
                </SafeAreaView>
                :
                <View style={styles.emptyContainer}>
                    <View>
                        <HeaderText style={styles.emptyText}>No comments to display</HeaderText>
                    </View>
                </View>
            }
            <SafeAreaView style={styles.inputContainer}>
                <View style={styles.writeCommentContainer}>
                    <TextInput
                        style={styles.input}
                        containerStyle={{}}
                        onChangeText={comment => setNewCommentText(comment)}
                        placeholder='Leave a comment...'
                        placeholderTextColor={Colors.grayDarker}
                        numberOfLines={1}
                        value={newCommentText}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => handleAddComment()}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    listContainer: {
        height: '90%',
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        marginTop: 0,
        marginBottom: 0,
        padding: 8,
        fontSize: 14,
        width: '80%',
        borderWidth: 0,
        borderColor: Colors.grayDarker,
        height: 50,
    },
    writeCommentContainer: {
        position: 'absolute',
        bottom: -5,
        flexDirection: 'row',
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.grayDark,
        backgroundColor: Colors.backgroundColor
    },
    sendBtn: {
        borderLeftWidth: 1,
        borderColor: Colors.grayDark,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendText: {
        fontSize: 12,
    },
    image: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 8,
    },
    date: {
        color: 'gray',
        fontSize: 8,
        marginLeft: 1
    },
    emptyText: {
        color: Colors.grayDark
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default BetComments;