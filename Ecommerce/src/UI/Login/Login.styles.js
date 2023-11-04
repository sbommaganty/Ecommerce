import {StyleSheet} from 'react-native';
import {Fonts} from '../../Resources/Fonts';

export const loginStyles = appData => {
  const {colors} = appData;
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.defaultBackgroundColor,
    },
    formContainer: {
      flex: 1,
      marginHorizontal: 48,
      marginTop: 20,
    },
    versionText: {
      fontSize: 12,
      color: colors.fontColor,
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    buttonContainerStyle: {marginVertical: 7},
    inputMainContainer: {
      height: 44,
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
  });
};
