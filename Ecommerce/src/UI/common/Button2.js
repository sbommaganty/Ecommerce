import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAppData} from '../../Provider/AppConfig';
import {buttonStyles} from './Button.styles';

export const Button2 = props => {
  const appData = useAppData();
  const {colors} = appData;
  const styles = buttonStyles(appData, props.invert, props.disabled);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (!props.disabled) {
          props.onPress && props.onPress();
        }
      }}
      style={[styles.mainContainer, props.mainContainer]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={
          props.disabled
            ? [colors.disableColor, colors.disableColor]
            : props.invert
            ? [colors.borderColor, colors.borderColor]
            : colors.gradientColor
        }
        style={[styles.subContainer, props.buttonStyle]}>
        {props.icon ? (
          props.icon
        ) : (
          <Text style={[styles.fontStyle, props.titleStyle]}>
            {props.title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
