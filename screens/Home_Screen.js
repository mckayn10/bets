import React, { useState, useEffect } from 'react';
import {StyleSheet, View, TouchableOpacity, Alert, Animated, Keyboard, Pressable} from 'react-native';
import { Button } from 'react-native-elements';
import NavBar from '../components/NavBar';
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import {fetchBets, fetchFeedBets} from '../store/actions/bets';
import {getUser, getUserPic, updateUser} from '../store/actions/auth';
import {fetchAllFriends, fetchBlockedBy, fetchBlockedUsers} from '../store/actions/friends';
import { fetchNotifications, fetchPendingRequests } from '../store/actions/notifications';
import HeaderText from '../components/HeaderText';
import {AntDesign, FontAwesome, Ionicons, SimpleLineIcons} from '@expo/vector-icons';
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

  const [showScreen, setShowScreen] = useState('feed');
  const [hasRun, setHasRun] = useState(false);
  const [completedBets, setCompletedBets] = useState([]);
  const [limitedCompleted, setLimitedCompletedBets] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);
  const [feedBets, setFeedBets] = useState([]);
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(8)
  const [activeAnimation, setActiveAnimation] = useState(new Animated.Value(0))

  const activeWidthInterpolate = activeAnimation.interpolate({
    inputRange: [0,1],
    outputRange: ['0.5%', '67.3%'],
  })

  const activeAnimatedStyle = {
    left: activeWidthInterpolate
  }

  const animatePending = () => {

    Animated.timing(activeAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false
    }).start()
  }

  const animateComplete = () => {
    Animated.timing(activeAnimation, {
      toValue: 0.5,
      duration: 400,
      useNativeDriver: false
    }).start()
  }

  const animateFeed = () => {
    Animated.timing(activeAnimation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false
    }).start()
  }

  const dispatch = useDispatch()

  const bets = useSelector(state => state.bets.bets)
  const allFeedBets = useSelector(state => state.bets.feedBets)
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
    dispatch(fetchFeedBets())
    dispatch(getUser())
    dispatch(fetchAllFriends())
    dispatch(fetchNotifications())
    dispatch(fetchBlockedBy())
    dispatch(fetchBlockedUsers())
    // dispatch(fetchPendingRequests())
    dispatch(getUserPic())

  }, [])

  useEffect(() => {
    getPendingBets()
    getCompletedBets()
    getFeedBets()
  }, [bets, allFeedBets])


  const getCompletedBets = () => {
    if(bets.length <= 0){
      return
    }
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
    getLimitedCompletedBets()
  }

  const getLimitedCompletedBets = (getMore = false) => {
    if(completedBets.length > 0){
      // let limited = completedBets.splice(0, endIndex)
      // setCompletedBets(completedBets)
      // console.log('length after slice', completedBets.length)
      // setLimitedCompletedBets([...limitedCompleted, ...limited])
      setLimitedCompletedBets(completedBets)
    }

  }

  const getFeedBets = () => {
    if(allFeedBets.length <= 0){
      return
    }

    allFeedBets.sort(function (x, y) {
      return y.date - x.date;
    })

    setFeedBets(allFeedBets)

  }

  const getPendingBets = () => {
    if(bets.length <= 0){
      return
    }
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
      animateComplete()
    } else if(screen == 'pending') {
      animatePending()
    } else if (screen == 'feed') {
      animateFeed()
    }

    setShowScreen(screen)
  }

  return (
    <View style={styles.container}>
      <NavBar props={props} />
      <View style={styles.toggleScreenContainer}>
        <Pressable  style={[styles.toggleBtn]}  onPress={() => toggleButtons('feed')}>
          <HeaderText style={styles.toggleText} >FEED</HeaderText>
        </Pressable>
        <Pressable  style={[styles.toggleBtn]} onPress={() => toggleButtons('complete')}>
          <HeaderText style={[styles.toggleText]} >COMPLETE</HeaderText>
        </Pressable>
        <Pressable  style={[styles.toggleBtn]} onPress={() => toggleButtons('pending')} >
          <HeaderText style={[styles.toggleText]} >PENDING</HeaderText>
        </Pressable>
        <Animated.View style={[styles.animatedToggle, activeAnimatedStyle]} />
      </View>
      {showScreen == 'complete' ? <BetList {...props} onEndReached={() => getLimitedCompletedBets(true)} bets={limitedCompleted} permissions={true} personId={userId} /> : null}
      {showScreen == 'pending' ? <BetList {...props} onEndReached={() => getLimitedCompletedBets(true)} bets={pendingBets} permissions={true} personId={userId} /> : null}
      {showScreen == 'feed' ? <BetList {...props} onEndReached={() => getLimitedCompletedBets(true)} bets={feedBets} feed={true} permissions={true} personId={userId} /> : null}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  toggleScreenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    width: '80%',
    borderRadius: 30,
    padding: 2,
    margin: 5,
    alignSelf: 'center',
  },
  btnContainer: {
    // position: 'absolute',
    // bottom: 50,
    // right: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    paddingTop: 12,
    paddingBottom: 13,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },
  createBetBtn: {
    width: '60%',
    fontSize: 15,
    alignSelf: 'center',
    backgroundColor: Colors.backgroundColor,
    color: Colors.primaryColor,
    fontWeight: 'bold',
    borderRadius: 50,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 0,
    paddingRight: 0
  },
  toggleBtn: {
    width: '33.3333%',
    borderRadius: 20,
    zIndex: 20000

  },
  toggleText: {
    color: Colors.primaryColor,
    paddingTop: 7,
    paddingBottom: 7,
    textAlign: 'center',
    fontSize: 12,
  },
  animatedToggle: {
    position: 'absolute',
    height: '100%',
    width: '33.3333%',
    backgroundColor: 'white',
    opacity: 0.9,
    borderRadius: 20,
    zIndex: 10000,
    marginLeft: 0
  },
  addIcon: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 100
  }
});

export default Home_Screen