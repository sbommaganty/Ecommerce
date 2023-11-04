/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {ScaledSheet} from 'react-native-size-matters';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ToastAndroid,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkPermission} from '../../Helper/PermissionHelper';
import {updateAgentStatus} from '../../API/ApiCalls';

export const ProfileScreen = ({
  isPortrait,
  LogoutHandler,
  binary,
  networkBanner,
  homePermission,
  toggleFunction,
  isAvailable,
}) => {
  const [permission, setPermission] = useState();
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    getAgentData();
  }, []);

  const getAgentData = async () => {
    try {
      const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      const asyncLoginData =
        JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;
      setLoginData(asyncLoginData.data);
      return asyncLoginData;
    } catch (e) {
      console.log(e);
    }
  };
  const showToast = () => {
    ToastAndroid.show(
      'Please allow all the permisions required',
      ToastAndroid.SHORT,
    );
  };

  const UpdateAgentStatusApi = async () => {
    try {
      // const JsonLOGINDATA = await AsyncStorage.getItem('LOGIN_DATA');
      // const asyncLoginData =
      //   JsonLOGINDATA != null ? JSON.parse(JsonLOGINDATA) : null;

      const asyncLoginData2 = await getAgentData();
      // console.log('?>?????>?>?>?>?>?>?>?>', asyncLoginData2);
      // console.log('?>?????>?>?>?>?>?>?>?>', asyncLoginData2.data.RetailerId);
      // console.log(
      //   '?>?????>?>?>?>?>?>?>?>',
      //   asyncLoginData2.data.RetailerUserId,
      // );
      // console.log('?>?????>?>?>?>?>?>?>?>', asyncLoginData2.agentSessionID);
      await updateAgentStatus(
        asyncLoginData2.data.RetailerId,
        asyncLoginData2.data.RetailerUserId,
        asyncLoginData2.agentSessionID,
        isAvailable ? 'NotAvailable' : 'Available',
      );
    } catch (e) {
      console.log(e);
      toggleFunction();
      Alert.alert('Error', e.message);
    }
  };

  const AsyncFunction = async () => {
    const PermissionResult = await checkPermission();
    // console.log('Permission in useEffect', PermissionResult);
    setPermission(PermissionResult);
    return PermissionResult;
  };

  const ExtraFunction = async () => {
    const permissionResult = await AsyncFunction();
    // console.log('permissionResult', permissionResult);
    if (permissionResult === 'granted') {
      await UpdateAgentStatusApi();
    }
  };

  // const toggleSwitch = () => {
  //   setIsAvailable(prev => !prev);
  //   return isAvailable;
  // };

  return (
    <View style={isPortrait ? styles.mainitem : styles.mainItemLandScape}>
      {/*  <View style={styles.mainItemLandScape}> */}
      {networkBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannertext}>
            Please check internet connection...
          </Text>
        </View>
      )}
      {homePermission === 'granted' || permission === 'granted' ? null : (
        <TouchableOpacity
          style={styles.permissionContainer}
          onPress={ExtraFunction}>
          <Text style={styles.permissionTxt}>Tap to grant permissions</Text>
        </TouchableOpacity>
      )}
      <View style={isPortrait ? styles.rowitem : styles.rowItemLandScape}>
        {/* <View style={styles.rowItemLandScape}> */}
        <Text style={styles.profileItem}>Profile</Text>
        <View style={styles.topItem}>
          <View style={styles.avaliableContainer}>
            <Text style={styles.profiletwoItem}>
              {homePermission === 'granted' && isAvailable && binary
                ? 'Avaliable'
                : 'Not avaliable'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              homePermission === 'granted' ? null : showToast();
            }}>
            <Switch
              trackColor={{true: '#00ff00', false: '#767577'}}
              thumbColor={isAvailable ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onChange={() => {
                toggleFunction();
                ExtraFunction();
              }}
              style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
              disabled={homePermission === 'granted' ? false : true}
              value={binary && isAvailable ? true : false}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={isPortrait ? styles.middleItem : styles.middleItemsLandScape}>
        {/* <View style={styles.middleItemsLandScape}> */}
        <View
          style={
            isPortrait
              ? styles.secondmiddleitem
              : styles.secondMiddleitemLandScape
          }>
          {/* <View style={styles.secondMiddleitemLandScape}> */}
          <Image
            source={require('../../Resources/Images/demoProfile.jpg')}
            style={styles.ImageItem}
          />
          <Text style={{...styles.textcolour, ...{fontWeight: 'bold'}}}>
            {loginData.FirstName} {loginData.LastName}
          </Text>
        </View>
        <View style={isPortrait ? null : styles.detailsLandScape}>
          {/* <View style={styles.detailsLandScape}> */}
          <View style={styles.thirdmiddleitem}>
            <Text style={styles.textbold}>Location</Text>
            <Text style={styles.textcolour}>
              510, Gulfgate Centre Mall, Houston ,TX 77098
            </Text>
          </View>
          <View style={styles.thirdmiddleitem}>
            <Text style={styles.textbold}>Skills & competencies</Text>
            <Text style={styles.textcolour}>Windows Surface</Text>
            <Text style={styles.textcolour}>HP Laptops</Text>
            <Text style={styles.textcolour}>System processors</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={LogoutHandler}>
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity style={styles.button} onPress={navigationHandler}>
          <Text style={styles.text}>Call Screen</Text>
        </TouchableOpacity> */}
      </View>
      {isPortrait && (
        <View style={styles.bottomLogo}>
          {/* <View style={styles.bottomLogoLandScape}> */}
          <Image
            source={require('../../Resources/Images/Logo.png')}
            style={styles.BelowImage}
          />
        </View>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  rowitem: {
    flexDirection: 'row',
    marginVertical: '40@vs',
    paddingBottom: '10@vs',
    justifyContent: 'space-between',
  },
  textcolour: {
    color: '#606060',
    fontWeight: '600',
    lineHeight: '20@vs',
    fontSize: '13@ms',
  },
  textbold: {
    fontWeight: 'bold',
    fontSize: '15@ms',
  },
  topItem: {
    flexDirection: 'row',
    // backgroundColor: 'yellow',
  },
  avaliableContainer: {
    // backgroundColor: 'yellow',
    width: '80@s',
  },
  permissionContainer: {
    // backgroundColor: 'red',
    height: '40@vs',
    // width: '100%',
    position: 'absolute',
    top: '10@vs',
    justifyContent: 'center',
    right: 0,
  },
  permissionTxt: {
    fontSize: '18@ms',
    color: 'red',
  },
  profileItem: {
    // backgroundColor: 'yellow',
    // paddingRight: '1@s',
    fontSize: '18@ms',
    color: '#606060',
    fontWeight: 'bold',
  },
  ImageItem: {
    // backgroundColor: 'yellow',
    marginBottom: '12@vs',
    width: '90@vs',
    height: '90@vs',
  },
  profiletwoItem: {
    color: '#ABB4BD',
    // position: 'relative',
    marginTop: '4@vs',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20@s',
    width: '30%',
    height: '10%',
    marginBottom: '50@vs',
    borderWidth: 2,
    borderColor: 'orange',
    backgroundColor: 'white',
    // display: 'none',
  },
  text: {
    fontSize: '12@s',
    lineHeight: '21@vs',
    fontWeight: 'bold',
    letterSpacing: '0.4@vs',
    color: 'orange',
  },
  secondmiddleitem: {
    paddingBottom: '20@vs',
  },
  thirdmiddleitem: {
    paddingBottom: '40@vs',
    display: 'flex',
  },
  middleItem: {
    flexDirection: 'column',
  },
  mainitem: {
    flex: 1,
    // padding: '0@s',
    // backgroundColor: 'teal',
    // marginLeft: 200,
    width: '320@s',
    // height: '500@vs',
  },
  bottomLogo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? '30@vs' : '50@vs',
    height: '90@vs',
    width: '80@s',
    alignSelf: 'center',
    // backgroundColor: 'yellow',
  },
  BelowImage: {
    // backgroundColor: 'yellow',
    alignSelf: 'center',
    // position: 'absolute',
    height: '70@vs',
    width: '60@vs',
  },
  bannertext: {
    textAlign: 'left',
    color: 'red',
    fontSize: '18@s',
  },
  bannerbox: {
    color: '#ff8c00',
    width: '50@s',
    height: '100@vs',
    alignSelf: 'center',
  },
  banner: {
    position: 'absolute',
    top: '5@vs',
    height: '4%',
    marginRight: '50@s',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  /////////////////////////////////////////////////////////
  mainItemLandScape: {
    // backgroundColor: 'yellow',
    flex: 1,
    width: '530@vs',
    height: '100%',
    position: 'absolute',
    left: '110@s',
  },
  rowItemLandScape: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '10@vs',
  },
  middleItemsLandScape: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // width: '90%',
    // height: '50%',
    flex: 1,
  },
  secondMiddleitemLandScape: {
    // position: 'absolute',
    marginRight: '40@s',
  },
  detailsLandScape: {
    // backgroundColor: 'red',
    marginTop: '10@s',
  },
  bottomLogoLandScape: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '70@s',
  },
});
