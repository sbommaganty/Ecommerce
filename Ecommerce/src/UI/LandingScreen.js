import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const LandingScreen = ({navigation}) => {
  const [internet, setinternet] = useState(false);
  SplashScreen.hide();

  useEffect(() => {
    Orientation.lockToPortrait();
    setTimeout(() => {
      const removeNetInfoSubscription = NetInfo.addEventListener(state => {
        if (state.isConnected === true && state.isInternetReachable === true) {
          setinternet(true);
        } else {
          setinternet(false);
        }
      });
      AsyncStorage.getItem('UserName').then(value => {
        if (internet === true) {
          value != null
            ? navigation.replace(value)
            : navigation.replace('Login');
        }
      });
      return () => removeNetInfoSubscription();
    }, 2000);
    // return () => removeNetInfoSubscription();
  }, [internet, navigation]);

  return (
    <View style={styles.gridItem}>
      <Image source={require('../../assets/Group.png')} />

      <Text style={styles.versionText}>
        {'\u00A9'}2020 SAMPLE, All rights reserved{'\n'} Version{' '}
        {DeviceInfo.getReadableVersion()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  versionText: {
    fontSize: 16,
    width: '100%',
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    color: '#606060',
  },
});
