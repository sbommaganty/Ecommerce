import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkPermission = async () => {
  const result = await requestMultiple(
    Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
      : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
  );
  console.log(
    'check Permission in permission Helper file',
    Platform.OS === 'ios'
      ? (result[PERMISSIONS.IOS.MICROPHONE], result[PERMISSIONS.IOS.CAMERA])
      : (result[PERMISSIONS.ANDROID.RECORD_AUDIO],
        result[PERMISSIONS.ANDROID.CAMERA]),
  );
  if (
    Platform.OS === 'android' &&
    result[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted' &&
    result[PERMISSIONS.ANDROID.CAMERA] === 'granted'
  ) {
    console.log('isGRanted for android');
    return result[PERMISSIONS.ANDROID.RECORD_AUDIO];
    // return 'granted';
  } else if (
    result[PERMISSIONS.IOS.MICROPHONE] === 'granted' &&
    result[PERMISSIONS.IOS.CAMERA] === 'granted'
  ) {
    console.log('isGRanted for IOS');
    return result[PERMISSIONS.IOS.MICROPHONE];
  } else {
    return null;
  }
};
