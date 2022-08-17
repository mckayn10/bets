import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Animated, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import NavBar from '../components/NavBar';
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBets } from '../store/actions/bets';
import {getUser, getUserPic, updateUser} from '../store/actions/auth';
import {fetchAllFriends, fetchBlockedBy, fetchBlockedUsers} from '../store/actions/friends';
import { fetchNotifications, fetchPendingRequests } from '../store/actions/notifications';
import HeaderText from '../components/HeaderText';
import { Ionicons } from '@expo/vector-icons';
import TestComponent from '../components/TestComponent';
import BetList from '../components/BetList';
import { completedCriteria, pendingCriteria } from '../constants/utils';
import UploadImage from '../components/UploadImage';
import { getProfilePic } from '../store/actions/auth';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Home_Screen(props) {

  const [showComplete, setShowComplete] = useState(true);
  const [completedBets, setCompletedBets] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(new Animated.Value(0))

  const activeWidthInterpolate = activeAnimation.interpolate({
    inputRange: [0,1],
    outputRange: ['0%', '50%'],
  })

  const activeAnimatedStyle = {
    left: activeWidthInterpolate
  }

  const animatePending = () => {

    Animated.timing(activeAnimation, {
      toValue: 1,
      duration: 220
    }).start()
  }

  const animateComplete = () => {
    Animated.timing(activeAnimation, {
      toValue: 0,
      duration: 220
    }).start()
  }

  const dispatch = useDispatch()

  const bets = useSelector(state => state.bets.bets)
  const userId = useSelector(state => state.auth.userId)

  const user = useSelector(state => state.auth.userInfo)
  const promptAddVenmo = () => {
    if(user){
      if(!user.venmo_id){
        props.navigation.navigate('Add Venmo')
      }
    }
  }

  useEffect(() => {
    promptAddVenmo()
  }, [user])

  useEffect(() => {

    dispatch(fetchBets())
    dispatch(getUser())
    dispatch(fetchAllFriends())
    dispatch(fetchNotifications())
    dispatch(fetchBlockedBy())
    dispatch(fetchBlockedUsers())
    // dispatch(fetchPendingRequests())
    dispatch(getUserPic())

  }, [])

  useEffect(() => {

  }, [])

  useEffect(() => {
    try {
      if (props.route.params) {
        setShowComplete(props.route.params.showComplete)
      }
    }
    catch (err) {
      console.error(err)
    }

  }, [props.route.params])

  useEffect(() => {
    getCompletedBets()
    getPendingBets()
  }, [bets])

  const getCompletedBets = () => {
    let completed = []
    bets.forEach((bet) => {
      let isComplete = completedCriteria(bet)
      if (isComplete) {
        completed.push(bet)
      }
    })
    completed.sort(function (x, y) {
      return y.date_complete - x.date_complete;
    })

    setCompletedBets(completed)
  }

  const getPendingBets = () => {
    let pending = []
    bets.forEach((bet) => {
      let isPending = pendingCriteria(bet)
      if (isPending) {
        pending.push(bet)
      }
    })
    pending.sort(function (x, y) {
      return y.date - x.date
    })
    setPendingBets(pending)
  }

  const toggleButtons = (screen) => {
    if(screen == 'complete'){
      setShowComplete(true)
      animateComplete()
    } else {
        setShowComplete(false)
        animatePending()
    }
  }

  return (

    <View style={styles.container}>
      <NavBar props={props} />
      <View style={styles.toggleScreenContainer}>
          <HeaderText style={[styles.toggleBtn, styles.toggleText]} onPress={() => toggleButtons('complete')}>COMPLETE</HeaderText>
          <HeaderText style={[styles.toggleBtn, styles.toggleText]} onPress={() => toggleButtons('pending')} >PENDING</HeaderText>
        <Animated.View style={[styles.animatedToggle, activeAnimatedStyle]} />
      </View>
      {/* <UploadImage /> */}
      {/* <TestComponent /> */}
      {showComplete
        ? <BetList {...props} bets={completedBets} permissions={true} personId={userId} />
        : <BetList {...props} bets={pendingBets} permissions={true} personId={userId} />
      }

      <TouchableOpacity
        style={styles.btnContainer}
      >
        {/* <Ionicons
          name="create-outline"
          size={26}
          color='green'
          onPress={() => props.navigation.navigate('Create Bet')}
        /> */}
        <Button
          title="Create New Bet"
          type="solid"
          buttonStyle={styles.createBetBtn}
          titleStyle={styles.createBetBtn}
          onPress={() => props.navigation.navigate('Create Bet')}
        />
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  toggleScreenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    width: '80%',
    borderRadius: 30,
    padding: 3,
    margin: 5,
    alignSelf: 'center'

  },
  btnContainer: {
    // position: 'absolute',
    // bottom: 50,
    // right: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  createBetBtn: {
    width: '80%',
    fontSize: 18,
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
    fontWeight: 'bold',
    borderRadius: 50,
    padding: 15
  },
  toggleBtn: {
    width: '50%',
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 20,
  },
  toggleText: {
    color: Colors.primaryColor,
    paddingTop: 12,
    paddingBottom: 13,
    fontSize: 12,
    textAlign: 'center',
  },
  animatedToggle: {
    position: 'absolute',
    height: '98%',
    width: '49%',
    backgroundColor: Colors.grayDark,
    opacity: 0.4,
    borderRadius: 20,
    margin: 5,

  }

});

export default Home_Screen