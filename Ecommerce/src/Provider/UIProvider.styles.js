import {StyleSheet} from 'react-native';

export const uiProviderStyles = appData => {
  return StyleSheet.create({
    spinnerView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: appData.colors.SpinnerBackgroud,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageStyle: {
      fontSize: 14,
      marginTop: 12,
    },
  });
};
