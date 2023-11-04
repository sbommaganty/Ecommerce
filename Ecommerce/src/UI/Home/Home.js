/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import BackgroundTimer from 'react-native-background-timer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProfileScreen} from './ProfileScreen';
import {deviceToken} from '../../API/ApiCalls';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation';
import messaging from '@react-native-firebase/messaging';
import {checkPermission} from '../../Helper/PermissionHelper';
import {updateAgentStatus} from '../../API/ApiCalls';
import {ScaledSheet} from 'react-native-size-matters';
import SignalChatFunc from './SignalChat';
import SignalChat3 from './SignalChat3';
import SignalChatClass from './o';
import crypto from '../../Helper/crypto';
import {apiIv, apiKey} from '../../Constants';

export function Home(props) {
  const [profile, setProfile] = useState(true);
  const [notification, setNotification] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [visible, setvisible] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const [random, setRandom] = useState(false);
  const [timeoutID, settimeoutID] = useState();
  const [isPortrait, setIsPortrait] = useState();
  const [isAvailable, setIsAvailable] = useState(true);
  const [permission, setPermission] = useState();
  const [binary, setBinary] = useState();
  const [networkBanner, setNetworkBanner] = useState();
  const [notificationData, setNotificationData] = useState({});
  const [profileData, setProfileData] = useState();
  const [decryptedKey, setDecryptedKey] = useState();
  console.log('decrypted Key from useState', decryptedKey);
  // console.log('decrypted Key =======', profileData.data.FirstName);
  // console.log('retailerDataaaaaaaaaa', retailerData);
  // console.log('<<<<<<Notification Data>>>>>>', notificationData);
  var Sound = require('react-native-sound');
  var whoosh;
  Sound.setCategory('Playback');

  // const openTokKey = retailerData.data.ConnectKey;

  const DecryptFunc = async () => {
    try {
      const JsonRETAILERCONFIGDATA = await AsyncStorage.getItem(
        'RETAILER_CONFIG',
      );
      const asyncRetailConfigData =
        JsonRETAILERCONFIGDATA != null
          ? JSON.parse(JsonRETAILERCONFIGDATA)
          : null;
      console.log(
        'asyncRetailConfigData=======',
        asyncRetailConfigData.data.ConnectKey,
      );
      // const apiKey = '46816214';
      const key = crypto.CryptoJS.enc.Utf8.parse(apiKey);
      const iv = crypto.CryptoJS.enc.Utf8.parse(apiIv);
      const options = {
        keySize: 128 / 8,
        iv: iv,
        mode: crypto.CryptoJS.mode.CBC,
        padding: crypto.CryptoJS.pad.Pkcs7,
      };
      // let decryptedKey = crypto.decrypt(openTokKey, key, options);
      const decryptedApiKey = crypto.decrypt(
        asyncRetailConfigData.data.ConnectKey,
        key,
        options,
      );
      console.log('Decrypted opentok api key:', decryptedApiKey);
      setDecryptedKey(decryptedApiKey);
      return asyncRetailConfigData;
    } catch (e) {
      console.log(e);
    }
  };

  const AsyncData = async () => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      const JsonRETAILERCONFIGDATA = await AsyncStorage.getItem(
        'RETAILER_CONFIG',
      );
      const asyncRetailConfigData =
        JsonRETAILERCONFIGDATA != null
          ? JSON.parse(JsonRETAILERCONFIGDATA)
          : null;

      return asyncLoginData;
    } catch (e) {
      console.log(e);
    }
  };

  const UpdateAgentStatusApi = async input => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      await updateAgentStatus(
        asyncLoginData.data.RetailerId,
        asyncLoginData.data.RetailerUserId,
        asyncLoginData.agentSessionID,
        input,
      );
      setBinary(true);
    } catch (e) {
      console.log(e);
      // Alert.alert('Error', e.message);
    }
  };
  const toggleSwitch = () => {
    setIsAvailable(prev => !prev);
    return isAvailable;
  };
  const AsyncFunction = async () => {
    const PermissionResult = await checkPermission();
    // console.log('Permission in useEffect', PermissionResult);
    setPermission(PermissionResult);
    return PermissionResult;
  };

  const ExtraFunction = async () => {
    // setIsToggleSuccess(true);
    // const login_Data = await AsyncStorage.getItem('LOGIN_DATA');
    const permissionResult = await AsyncFunction();
    // const permissionResult = await AsyncFunction2();
    // console.log('permissionResult', permissionResult);
    if (permissionResult === 'granted') {
      await UpdateAgentStatusApi('Available');
    }
  };

  const setAsyncToken = async token => {
    await AsyncStorage.setItem('FirebaseDeviceToken', token);

    console.log('device token method executed');
    console.log('token excuted', token);
  };

  // for background notifications
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const onaudioRun = () => {
    setvisible(true);
    whoosh = new Sound('audio.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
    });
    console.log(
      'duration in seconds: ' +
        whoosh.getDuration() +
        'number of channels: ' +
        whoosh.getNumberOfChannels(),
    );

    BackgroundTimer.runBackgroundTimer(() => {
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }, whoosh.getDuration());
    whoosh.setNumberOfLoops(-1);
    var timeouttID = setTimeout(() => {
      console.log('pause');
      setvisible(false);
      BackgroundTimer.stopBackgroundTimer();
      whoosh.stop(() => {
        // Note: If you want to play a sound after stopping and rewinding it,
        // it is important to call play() in a callback.
        //whoosh.play();
      });
      whoosh.release();
    }, 30000);
    settimeoutID(timeouttID);
    // Complete with null means don't show a notification.
  };

  // Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notificationReceivedEvent,
      );
      let notificationreceived = notificationReceivedEvent.getNotification();
      console.log('notification: ', notificationreceived);
      notificationReceivedEvent.complete(notificationreceived);
      setNotificationData(notificationreceived);
      onaudioRun();
    },
  );

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(opennotification => {
    console.log('OneSignal: notification opened:', opennotification);
  });

  useEffect(() => {
    // console.log('Platform OS', Platform.OS);
    const extraFunction = async () => {
      const AsyncDataResponse = await AsyncData();
      console.log('profile data', AsyncDataResponse);
      setProfileData(AsyncDataResponse);
      // const retailerConfigValues = await AsyncData2();
      DecryptFunc();

      // setRetailerData(retailerConfigValues);
      // console.log('retailer data============', retailerConfigValues);
      const getToken = await messaging().getToken();
      //const oneSignalPlayerID = await AsyncStorage.getItem('oneSignalPlayerID');
      console.log('firebasetoken', getToken);

      try {
        const oneSignalPlayeruserID = (await OneSignal.getDeviceState()).userId;
        console.log('onesignalplayerId', oneSignalPlayeruserID);
        await AsyncStorage.setItem('oneSignalPlayerID', oneSignalPlayeruserID);
        AsyncStorage.getItem('FirebaseDeviceToken').then(value => {
          if (value === getToken) {
            console.log('token is same no need to update');
          } else {
            setAsyncToken(getToken);
            deviceToken(
              AsyncDataResponse.data.Email,
              getToken,
              getToken,
              Platform.OS === 'android' ? 'Android' : 'iOS',
              // "Android",
              DeviceInfo.getReadableVersion(),
              AsyncDataResponse.data.RetailerId,
              AsyncDataResponse.data.RetailerUserId,
              AsyncDataResponse.agentSessionID,
              oneSignalPlayeruserID,
            );
          }
        });

        // console.log('end of extra function');
      } catch (e) {
        console.log('ERROR', e);
      }
    };
    try {
      extraFunction();
    } catch (e) {
      console.log(e);
    }

    Orientation.unlockAllOrientations();
    const initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }

    const _orientationDidChange = orientation => {
      if (orientation === 'LANDSCAPE') {
        setIsPortrait(false);
      } else {
        setIsPortrait(true);
      }
      // return orientation;
    };
    Orientation.addOrientationListener(_orientationDidChange);

    return () => Orientation.removeOrientationListener(_orientationDidChange);
  }, []);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      if (state.isConnected === true && state.isInternetReachable === true) {
        setNetworkBanner(false);
        ExtraFunction();
      } else {
        setNetworkBanner(true);
      }
    });
    return () => removeNetInfoSubscription();
  }, []);
  // console.log('LOGIN_DATA', loginData);
  //console.log('RETAILER_CONFIG', retailConfigData);

  const LogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('UserName');
      props.navigation.navigate('Login');
    } catch (e) {
      console.log('Error on logout===>', e);
    }
  };

  const profileHandler = () => {
    setProfile(true);
    setNotification(false);
    setCalendar(false);
    setCatalog(false);
    setRandom(false);
  };
  const notificationHandler = () => {
    setProfile(false);
    setNotification(true);
    setCalendar(false);
    setCatalog(false);
    setRandom(false);
  };

  const calendarHandler = () => {
    setProfile(false);
    setNotification(false);
    setCalendar(true);
    setCatalog(false);
    setRandom(false);
  };

  const catalogHandler = () => {
    setProfile(false);
    setNotification(false);
    setCalendar(false);
    setCatalog(true);
    setRandom(false);
  };

  const randomHandler = () => {
    setProfile(false);
    setNotification(false);
    setCalendar(false);
    setCatalog(false);
    setRandom(true);
  };

  function onCancel() {
    setvisible(false);
    console.log('stop1');
    BackgroundTimer.stopBackgroundTimer();
    console.log('timeoutId', timeoutID);
    clearTimeout(timeoutID);
    console.log('stop3');
  }

  const BottomTab = () => {
    return (
      <>
        <TouchableOpacity style={styles.iconContainer} onPress={profileHandler}>
          <FontAwesome
            name="user-circle"
            size={profile ? 30 : 24}
            color={profile ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={notificationHandler}>
          <Ionicons
            name="notifications"
            size={notification ? 30 : 24}
            color={notification ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={calendarHandler}>
          <FontAwesome
            name="calendar-o"
            size={calendar ? 30 : 24}
            color={calendar ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={catalogHandler}>
          <MaterialCommunityIcons
            name="format-page-break"
            size={catalog ? 30 : 24}
            color={catalog ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={randomHandler}>
          <Octicons
            name="book"
            size={random ? 30 : 24}
            color={random ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          />
        </TouchableOpacity>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} visible={visible}>
        {visible && (
          <View style={styles.banner}>
            <Text style={styles.bannertext}>Incoming Call</Text>

            <Button
              title="Accept"
              style={styles.bannerbox}
              color="#ff7f50"
              onPress={() => {
                try {
                  props.navigation.navigate('CallScreen', {
                    notificationData,
                    decryptedKey,
                    profileData,
                  });
                  onCancel();
                } catch (e) {
                  console.log(e);
                }
              }}
            />

            <Button
              title="Decline"
              style={styles.bannerbox}
              color="#ff7f50"
              onPress={() => {
                onCancel();
              }}
            />
          </View>
        )}
      </Modal>
      {profile && (
        <ProfileScreen
          LogoutHandler={LogoutHandler}
          isPortrait={isPortrait}
          binary={binary}
          networkBanner={networkBanner}
          homePermission={permission}
          toggleFunction={toggleSwitch}
          isAvailable={isAvailable}
        />
      )}

      {notification && (
        <View>
          <Text style={styles.screenText}>Notification screen</Text>
          {/* <SignalChatFunc /> */}
        </View>
      )}
      {calendar && (
        <View>
          <Text style={styles.screenText}>calendar Screen</Text>
        </View>
      )}
      {catalog && (
        <View>
          <Text style={styles.screenText}>Catalog</Text>
        </View>
      )}
      {random && (
        <View>
          <Text style={styles.screenText}>Random screen</Text>
          {/* <SignalChatClass /> */}
        </View>
      )}
      <KeyboardAvoidingView
        style={isPortrait ? styles.BottomTabConatiner : styles.sideTab}>
        {/* <View style={styles.sideTab}> */}
        {BottomTab()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
  },
  BottomTabConatiner: {
    position: 'absolute',
    bottom: 0,
    // flex: 1,
    width: '100%',
    height: Platform.OS === 'ios' ? '70@vs' : '65@vs',
    backgroundColor: '#FB8B24',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-end',
    // marginBottom: 20,
    paddingBottom: Platform.OS === 'ios' ? '15@vs' : 0,
  },
  sideTab: {
    position: 'absolute',
    height: '107%',
    width: Platform.OS === 'ios' ? '90@s' : '80@s',
    left: 0,
    backgroundColor: '#FB8B24',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? '20@s' : 0,
    paddingVertical: '16@vs',
  },
  bannertext: {
    textAlign: 'left',
    color: '#f8f8ff',
  },
  bannerbox: {
    color: '#ff8c00',
    width: '50@s',
    height: '100@vs',
    alignSelf: 'center',
  },
  banner: {
    position: 'absolute',
    top: '6@vs',
    height: '14%',
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    height: '60@vs',
    width: '60@s',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    fontSize: '30@ms',
  },
});
