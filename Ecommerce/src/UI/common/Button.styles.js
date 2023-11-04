import {StyleSheet} from 'react-native';
// import {Fonts} from '../../Resources/Fonts';

export const buttonStyles = (appData, isInvert, disabled) => {
  const {colors} = appData;
  return StyleSheet.create({
    mainContainer: {width: '100%'},
    subContainer: {
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      ...(isInvert && !disabled
        ? {
            borderWidth: 2,
            borderColor: colors.borderColor,
            padding: 12,
          }
        : {}),
    },
    fontStyle: {
      fontSize: 16,
      color: isInvert && !disabled ? colors.invertFontColor : colors.fontColor,
    },
  });
};
