import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Modable, Pressable, Text } from 'react-native';
import NavBar from '../components/NavBar';
import Completed_Bets_Screen from './Completed_Bets_Screen';
import Incomplete_Bets_Screen from './Incomplete_Bets_Screen';
import Colors from '../constants/colors'
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-swiper/src'
import CreateBetModal from '../modals/CreateBetModal';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchBets } from '../store/actions/bets';

const Home_Screen = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);

  const dispatch = useDispatch()

  useEffect(() => {
    try{
      dispatch(fetchBets())
    } 
    catch(err){
      console.error(err)
    }
  }, [dispatch])

  return (

    <View style={styles.container}>
      <NavBar />
      <View style={styles.toggleScreenContainer}>
        <Text style={swiperIndex === 0 ? styles.activeToggleText : styles.toggleText} onPress={() => setSwiperIndex(0)}>COMPLETE</Text>
        <Text style={swiperIndex === 1 ? styles.activeToggleText : styles.toggleText} onPress={() => setSwiperIndex(1)}>INCOMPLETE</Text>
      </View>
      <Swiper
        scrollEnabled={false}
        index={swiperIndex}
        loop={false}
        showsPagination={false}
      >
        <Completed_Bets_Screen />
        <Incomplete_Bets_Screen />
      </Swiper>
      <CreateBetModal
        toggleModal={() => setModalVisible(!modalVisible)}
        modalVisible={modalVisible}
      />
      <View
        style={styles.btnContainer}
      >
        <AntDesign
          name="pluscircle"
          size={45}
          color={Colors.primaryColor}
          onPress={() => setModalVisible(true)}
        />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleScreenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundColor,
    backgroundColor: Colors.primaryColor,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryColor
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  btnContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    bottom: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    alignSelf: 'center'
  },
  toggleText: {
    flex: 1,
    color: Colors.backgroundColor,
    paddingTop: 12,
    paddingBottom: 13,
    fontSize: 12,
    textAlign: 'center',
  },
  activeToggleText: {
    flex: 1,
    color: Colors.primaryColor,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 12,
    paddingBottom: 13,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',

  }

});

export default Home_Screen