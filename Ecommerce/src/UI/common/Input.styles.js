import {Platform, StyleSheet} from 'react-native';
// import {Fonts} from '../../Resources/Fonts';

export const inputStyles = (appData, isFocused) => {
  const {colors} = appData;
  return StyleSheet.create({
    mainContainerStyle: {
      borderBottomWidth: 1,
      paddingBottom: 0,
      borderColor: colors.borderColor,
      // backgroundColor: 'teal',
    },
    headingTextstyle: {
      fontSize: 13,
      color: colors.fontColor,
      marginBottom: Platform.OS === 'ios' ? 8 : 0,
    },
    inputTextStyles: {
      fontSize: 16,
      color: colors.fontColor,
    },
    placeHolderTextStyles: {
      fontSize: 16,
      color: colors.placeHolderTextColor,
    },
    dateMainContainer: {flex: 1, justifyContent: 'flex-end'},
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    checkboxContainer: {flexDirection: 'row', marginVertical: 5},
    checkboxStyle: {width: 20, height: 20, marginLeft: 2, marginRight: 10},
    radiobuttonContainer: {flex: 1, flexWrap: 'wrap', flexDirection: 'row'},
    radioButtonStyle: {marginLeft: 10},
    radioLabelTextStyle: {
      fontSize: 16,
      color: colors.fontColor,
    },
    radioLabelStyle: {},
  });
};
