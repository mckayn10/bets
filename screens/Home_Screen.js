import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import NavBar from '../components/NavBar';
import Completed_Bets_Screen from './Completed_Bets_Screen';
import Incomplete_Bets_Screen from './Incomplete_Bets_Screen';
import Colors from '../constants/colors'
import { AntDesign } from '@expo/vector-icons';
import CreateBetModal from '../modals/CreateBetModal';
import { useDispatch } from 'react-redux';
import { fetchBets } from '../store/actions/bets';
import HeaderText from '../components/HeaderText';

function Home_Screen(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [showComplete, setShowComplete] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    try {
      dispatch(fetchBets())
    }
    catch (err) {
      console.error(err)
    }
  }, [dispatch])

  return (

    <View style={styles.container}>
      <NavBar props={props} />
      <View style={styles.toggleScreenContainer}>
        <HeaderText style={showComplete  ? styles.activeToggleText : styles.toggleText} onPress={() => setShowComplete(true)}>COMPLETE</HeaderText>
        <HeaderText style={!showComplete ? styles.activeToggleText : styles.toggleText} onPress={() => setShowComplete(false)}>PENDING</HeaderText>
      </View>
      {showComplete
        ? <Completed_Bets_Screen />
        : <Incomplete_Bets_Screen />
      }
      <CreateBetModal
        toggleModal={() => setModalVisible(!modalVisible)}
        modalVisible={modalVisible}
        showComplete={(showComplete) => setShowComplete(showComplete)}
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
    backgroundColor: Colors.accentColor,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentColor
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
  }

});

export default Home_Screen