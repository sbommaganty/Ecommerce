import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {ScaledSheet} from 'react-native-size-matters';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Input} from '../common/Input';
import {Button} from '../common/Button';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
// import axios from 'axios';
import {login, retailerConfig} from '../../API/ApiCalls';

export const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState();

  const [emailResult, setEmailresult] = useState(false);

  const emailcheck =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  useEffect(() => {
    Orientation.lockToPortrait();
  });
  const emailHandler = value => {
    const condition = emailcheck.test(String(value));

    if (value === '') {
      setEmail(value);
    } else if (condition === false) {
      setEmail(value);
      setEmailresult(false);
    } else if (condition === true) {
      setEmail(value);
      setEmailresult(true);
    }
  };

  const mobileHandler = value => {
    setMobile(value);
  };
  const navigate = async () => {
    await AsyncStorage.setItem('UserName', 'PostLoginStack');
    navigation.replace('PostLoginStack');
  };
  const LoginHandler = async () => {
    try {
      const LoginResponseData = await login(email, mobile);
      console.log('LoginResponseData', LoginResponseData.status);
      if (LoginResponseData.status === 200) {
        const RetailerId = LoginResponseData.data.data.RetailerId;
        const RetailerUserId = LoginResponseData.data.data.RetailerUserId;
        const AgentSessionId = LoginResponseData.data.agentSessioinId;

        console.log('ID....', RetailerId, RetailerUserId, AgentSessionId);

        const retailerConfigData = await retailerConfig(
          RetailerId,
          RetailerUserId,
          AgentSessionId,
        );
        console.log('>>>>>>>>>>>>>>>>>>>>', retailerConfigData.data);
        if (retailerConfigData.status === 200) {
          emailResult
            ? mobile
              ? navigate()
              : Alert.alert('Error', 'Enter valid Password')
            : Alert.alert('Error', 'Enter valid Email ID ');
          console.log('Result status is 200 in retail config');
        } else {
          console.log('Error, result status is not 200 in retail config');
        }
      } else {
        console.log('Error, result status is not 200 in Login');
      }

      // console.log('Return RetailerConfig response', retailerConfigData);
    } catch (error) {
      console.log('Error from Login Screen--->', error);
      Alert.alert('Error', error.message);
    }
  };

  const Logo = () => {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={require('../../Resources/Images/Logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    );
  };
  const Inputs = () => {
    return (
      <>
        <Input
          label={'Email'}
          inputType={'text'}
          value={email}
          onUpdate={emailHandler}
          textInputProps={{
            keyboardType: 'email-address',
            autoCorrect: false,
            autoCapitalize: 'none',
            clearButtonMode: 'always',
          }}
          mainContainerStyle={styles.inputMainContainer}
        />
        <Input
          label={'Password'}
          inputType={'text'}
          value={mobile}
          onUpdate={mobileHandler}
          isPassword={true}
          textInputProps={{
            autoCorrect: false,
            autoCapitalize: 'none',
            clearButtonMode: 'always',
          }}
          mainContainerStyle={styles.inputMainContainer}
        />
      </>
    );
  };
  const LoginButton = () => {
    return (
      <Button
        mainContainerStyle={{
          ...styles.btnContainer,
          ...{
            backgroundColor: email && mobile ? '#FB8B24' : '#ABB4BD',
          },
        }}
        title="Login"
        onPress={LoginHandler}
        isDisabled={!email || !mobile}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        enabled
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* <SafeAreaView> */}
        {/* <Logo /> */}
        {Logo()}
        <View style={styles.inputContainer}>
          {/* <Inputs /> */}
          {/* <LoginButton /> */}
          {Inputs()}
        </View>
        {LoginButton()}
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => {
            navigation.navigate('ForgotPasswordScreen');
          }}>
          <Text style={styles.forgotTxt}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* </SafeAreaView> */}
        <KeyboardAvoidingView
          style={styles.versionContainer}
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={styles.versionText}>
            {'\u00A9'}2021 SAMPLE, All rights reserved{'\n'} Version{' '}
            {DeviceInfo.getReadableVersion()}
          </Text>
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'yellow',
    // height: '80%',
    justifyContent: 'center',
  },
  inputContainer: {
    // backgroundColor: 'red',
    width: '310@s',
    height: '160@vs',
    marginTop: '40@vs',

    justifyContent: 'center',
    // padding:10
  },
  inputMainContainer: {
    marginVertical: '20@vs',
    // backgroundColor: 'teal',
    // height: 35,
    // paddingVertical: 0,
    // fontSize: 30,
  },
  logoContainer: {
    // backgroundColor: 'yellow',
    // alignItems: 'center',
    // height: '150@vs',
    // width: '120@s',
    marginTop: Platform.OS === 'ios' ? '90@vs' : '60@vs',
    // resizeMode: '',
    // overflow: 'hidden',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // height: '140@vs',
    // width: '140@s',
    // position: 'absolute',
  },
  logoImage: {
    // position: 'absolute',
    // flex: 1,
    // height: 200,
    // width: 200,
    alignSelf: 'center',
    height: '130@vs',
    width: '110@s',
  },
  btnContainer: {
    width: '310@s',
    marginTop: '50@vs',
  },
  versionContainer: {
    flex: 1,
    // marginTop: 70,
    // height: 50,
    // backgroundColor: 'green',
    justifyContent: 'flex-end',
    marginBottom: '20@vs',
    // position: 'absolute',
    // bottom: 20,
  },
  versionText: {
    fontSize: '11@ms',
    color: '#606060',
    textAlign: 'center',
  },
  forgotContainer: {
    // backgroundColor: 'red',
    marginTop: '15@vs',
  },
  forgotTxt: {
    color: '#FB8B24',
    fontWeight: 'bold',
    fontSize: '14@ms',
  },
});
