//import liraries
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {AgentForgotPassword} from '../../API/ApiCalls';

// create a component
export const ForgotPasswordScreen = props => {
  const [email, setEmail] = useState('');
  const [emailResult, setEmailresult] = useState(false);
  const emailcheck =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
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
  const LoginHandler = async () => {
    try {
      const AgentForgotPasswordRes = await AgentForgotPassword(email);
      console.log('Agent Forgot Password Resonse', AgentForgotPasswordRes.data);
      if (emailResult) {
        console.log(emailResult);
        if (AgentForgotPasswordRes.status === 200) {
          Alert.alert(
            'Reset Password',
            'Reset Link has been sent to your email',
          );
          props.navigation.navigate('Login');
        } else {
          console.log('Response failed in Forgot Screen');
        }
      } else {
        Alert.alert('Error', 'Enter valid Email ID ');
      }
    } catch (error) {
      console.log('Error from Forgot password Screen--->', error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../Resources/Images/Logo.png')} />
        </View>
        <Input
          label={'Email'}
          inputType={'text'}
          value={email}
          onUpdate={emailHandler}
          textInputProps={{
            keyboardType: 'email-address',
          }}
          mainContainerStyle={styles.inputMainContainer}
        />
        <Button
          mainContainerStyle={{
            ...styles.btnContainer,
            ...{
              backgroundColor: email ? '#FB8B24' : '#ABB4BD',
            },
          }}
          title="Reset Password"
          onPress={LoginHandler}
          isDisabled={!email}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputMainContainer: {
    marginBottom: 50,
    width: '80%',
  },
  logoContainer: {
    // alignItems: 'center',
    marginVertical: 100,
  },
});
