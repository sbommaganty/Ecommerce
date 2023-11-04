import {StyleSheet} from 'react-native';
import {isIphoneX} from '../../Helper/iphoneHelper';
// import {Fonts} from '../../Resources/Fonts';

export const headerStyles = appData => {
  return StyleSheet.create({
    mainContainerStyle: {
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
      shadowColor: appData.colors.shadowColor,
      shadowOffset: {height: 5, width: 0},
      shadowOpacity: 1,
      elevation: 5,
    },
    imageContainerStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
      elevation: 5,
      overflow: 'hidden',
    },
    subContainerStyle: {
      paddingHorizontal: 28,
      paddingVertical: 16,
      paddingTop: isIphoneX() ? 70 : 16,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      zIndex: 1,
    },
    iconContainerStyle: {marginRight: 28},
    titleStyle: {
      fontSize: 14,
      color: appData.colors.fontColor,
    },
    subTitleStyle: {
      fontSize: 12,
      color: appData.colors.fontColor,
    },
    gradientContianer: {
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
      elevation: 5,
    },
  });
};
