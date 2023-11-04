import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

var emailerror = 'Please enter your Email ID !';
var passerror = 'Please enter your password !';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
const StartLoginScreen = ({navigation}) => {
  const [emailText, SetEmailText] = useState('');
  const [passwordText, SetPasswordText] = useState('');

  const [emailResult, setEmailresult] = useState(false);
  const [passResult, setPassresult] = useState(false);

  const getData = () => {
    try {
      AsyncStorage.getItem('UserName').then(value => {
        if (value != null) {
          navigation.navigate(value);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  });

  let emailcheck =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  let passcheck = /[a-z0-9!#$%&'*+/=?^_`{|}~-]/;

  const onEmailChanged = enteredEmail => {
    let condition = emailcheck.test(String(enteredEmail));

    if (enteredEmail === '') {
      SetEmailText(enteredEmail);
      emailerror = 'Please enter your EmailID!';
    } else if (condition === false) {
      emailerror = 'Please enter a valid Email ID !';
      SetEmailText(enteredEmail);
      setEmailresult(false);
    } else if (condition === true) {
      SetEmailText(enteredEmail);
      setEmailresult(true);
    }
  };
  const onPasswordChanged = enteredPassword => {
    let passtext = String(enteredPassword);
    let condition = passcheck.test(String(enteredPassword));

    if (passtext === '') {
      passerror = 'Please your password !';

      SetPasswordText(enteredPassword);
    } else if (condition === false || passtext.length < 6) {
      passerror =
        'The length of the password should be greater than 6, so please add Letters, Numbers, Symbols etc !';

      SetPasswordText(enteredPassword);
      setPassresult(false);
    } else if (condition === true && /\d/.test(passtext) === true) {
      SetPasswordText(enteredPassword);
      setPassresult(true);
    } else {
      SetPasswordText(enteredPassword);
    }
  };
  //by using props as well as navigation pass is possible
  const OnButtonPress = async () => {
    if (emailResult === true && passResult === true) {
      try {
        await AsyncStorage.setItem('UserName', 'Screen_B');
        navigation.navigate('Screen_B', {
          userName: emailText,
          Password: passwordText,
        });
      } catch (error) {
        console.log(error);
      }
    } else if (passwordText === '' || emailText === '') {
      Alert.alert('Login Failure', String('Please enter all required fields'), [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  // const OnClearPress = () => {
  //   if (emailText === '' && passwordText === '') {
  //     Alert.alert('Login Page', 'The Text Fields are already empty !', [
  //       {text: 'OK', onPress: () => console.log('OK Pressed')},
  //     ]);
  //   }
  //   SetEmailText('');
  //   SetPasswordText('');
  //   setEmailresult(false);
  //   setPassresult(false);
  //   emailerror = 'Please enter your Email ID !';
  //   passerror = 'Please enter your password !';
  // };
  return (
    <DismissKeyboard>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your Email ID"
          style={styles.input}
          onChangeText={onEmailChanged}
          value={emailText}
        />

        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry={true}
          onChangeText={onPasswordChanged}
          value={passwordText}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.buttonContainer}>
            <Button title="LOGIN" onPress={OnButtonPress} />
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    fontSize: 30,
    fontWeight: 'bold',
  },

  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 3,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  button: {
    width: '50%',
    paddingTop: '5%',
    paddingBottom: '5%',
  },
});

export default StartLoginScreen;
