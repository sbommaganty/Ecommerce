import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button} from '../common/Button';
import DeviceInfo from 'react-native-device-info';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const OTPScreen = props => {
  console.log(windowHeight, windowWidth);
  const [code, setCode] = useState();

  console.log(code);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../Resources/Images/Logo.png')} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textstyle}>
              Enter 4 digit code sent to you at ******4575
            </Text>
          </View>
          <View style={styles.otpConatiner}>
            <OTPInputView
              pinCount={4}
              autoFocusOnLoad
              code={code}
              onCodeChanged={e => setCode(e)}
              onCodeFilled={value => {
                console.log(`Code is ${value}, you are good to go!`);
              }}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
          </View>
          <Button
            mainContainerStyle={{
              ...styles.btnContainer,
              ...{
                backgroundColor:
                  code && code.toString().length === 4 ? '#FB8B24' : '#ABB4BD',
              },
            }}
            title="Login"
            onPress={() =>
              code && code.toString().length === 4
                ? console.log('navigated')
                : Alert.alert('Error', 'Please enter all 4 digits')
            }
          />
        </View>
        <Text style={styles.versionText}>
          Version {DeviceInfo.getReadableVersion()}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    backgroundColor: 'white',

    width: windowWidth * 0.8,
    bottom: 20,
  },
  inputMainContainer: {
    marginVertical: 20,
  },
  logoContainer: {
    height: windowHeight * 0.25,
    // backgroundColor: 'yellow',
    width: windowWidth * 0.4,
    bottom: 20,
    alignItems: 'center',
  },
  btnContainer: {
    width: windowWidth * 0.8,
    marginTop: 60,
  },
  versionText: {
    fontSize: 12,
    top: 80,
    color: '#606060',
  },
  textContainer: {
    // backgroundColor: 'yellow',
    height: 70,
    marginVertical: 16,
    // flexDirection: 'row',
  },
  textstyle: {
    fontSize: 22,
    color: '#606060',
  },
  otpConatiner: {
    height: 60,
  },
  underlineStyleBase: {
    width: 40,
    height: 55,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ABB4BD',
  },

  underlineStyleHighLighted: {
    borderColor: '#FB8B24',
  },
});

{
  /* <View style={{display: idno === 1 ? 'flex' : 'none', flex: 1}}>
  <View
    style={{
      width: '100%',
      height: '85%',
      marginTop: 60,
      position: 'absolute',
      backgroundColor: 'black',
      alignSelf: 'center',
    }}>
    <FlatList
      contentContainerStyle={{
        alignItems: 'flex-end',
        alignContent: 'space-around',
        padding: 10,
      }}
      keyExtractor={(item, index) => index}
      data={chatgoals}
      inverted={true}
      renderItem={chatText}
    />
  </View>
  {videoButton()}
  {/* <Image
resizeMode='contain'
source={require('./assets/group.png')}
style={{width: '60%',  height: '46%', alignSelf: 'center', marginTop: 150}}
        /> */
}

//   <View style={styles.textinputandsend}>
//     <View style={styles.addinputstyle}>
//       <TouchableOpacity style={styles.imageStyle}>
//         <MaterialCommunityIcons
//           name="paperclip"
//           style={{flex: 1}}
//           size={25}
//           color={'#696969'}
//         />
//       </TouchableOpacity>
//       <TextInput
//         style={{width: '80%'}}
//         placeholder="Type Message Here"
//         onChangeText={goalInputHandler}
//         value={enteredGoal}
//         underlineColorAndroid="transparent"
//       />
//     </View>
//     <View style={styles.sendview}>
//       <TouchableOpacity
//         onPress={() => {
//           if (enteredGoal) {
//             setEnteredGoal('');
//             addGoalHandler(enteredGoal, 'text');
//           }
//         }}>
//         <FontAwesome5
//           name="paper-plane"
//           style={{alignSelf: 'center'}}
//           size={20}
//           color={video ? '#696969' : 'white'}
//         />
//       </TouchableOpacity>
//     </View>
//   </View>
// </View>; */}
