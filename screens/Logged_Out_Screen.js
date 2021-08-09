import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Swiper from 'react-native-swiper/src';
import Login_Screen from './Login_Screen';
import Register_Screen from './Register_Screen'
import Auth_Screen from './Auth_Screen';

export default Logged_Out_Screen = () => {

  return (
      <View style={styles.container}>
        <Auth_Screen />
        {/* <Swiper
          loop={false}
          activeDot={<View style={{ backgroundColor: 'white', width: 15, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
          dot={<View style={{ backgroundColor: 'rgba(0,0,0,.5)', width: 10, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
          showsButtons={true}
          buttonWrapperStyle={{ flexDirection: 'column', height: '80%', justifyContent: 'flex-end', alignItems: 'center' }}
          nextButton={
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Not registered? </Text>
              <Text style={[styles.registerText, styles.createText]}>Create an account.</Text>
            </View>
          }
          prevButton={
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <Text style={[styles.registerText, styles.createText]}>Sign in.</Text>
            </View>
          }
        >
          <Login_Screen />
          <Register_Screen />
        </Swiper> */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 30,
    color: 'white'
  },
  registerText: {
    color: 'white'
  },
  createText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'white'
  }
});
