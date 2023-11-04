import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export const Button = props => {
  return (
    <TouchableOpacity
      disabled={props.isDisabled}
      activeOpacity={0.9}
      style={[styles.mainContainer, props.mainContainerStyle]}
      onPress={props.onPress}>
      <Text style={[styles.textStyle, props.TitleStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FB8B24',
    height: 50,
    width: 320,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
  },
});
